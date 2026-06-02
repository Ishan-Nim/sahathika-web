import asyncio, os, re, json
from playwright.async_api import async_playwright
from urllib.parse import urlparse

SAVE_ROOT = r"G:\Draft\Sahathika\cert_images"
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"}
IMAGE_TYPES = {"image/png","image/jpeg","image/gif","image/svg+xml","image/webp"}

WALLETS = [
    {"slug": "ishannim725761", "url": "https://www.credential.net/profile/ishannim725761/wallet"},
    {"slug": "h4rithd",        "url": "https://www.credential.net/profile/h4rithd/wallet"},
]

def safe_fname(url, idx):
    path = urlparse(url).path
    ext = os.path.splitext(path)[1].lower()
    if ext not in IMAGE_EXTS: ext = ".png"
    base = re.sub(r"[^\w\-]", "_", os.path.basename(path))[:60] or f"img_{idx}"
    return f"{idx:03d}_{base}{'' if base.endswith(ext) else ext}"

async def scrape(browser, wallet):
    slug, url = wallet["slug"], wallet["url"]
    save_dir = os.path.join(SAVE_ROOT, f"wallet_{slug}")
    os.makedirs(save_dir, exist_ok=True)

    ctx = await browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36",
        viewport={"width": 1280, "height": 900},
    )
    page = await ctx.new_page()
    intercepted = {}

    async def on_resp(resp):
        ct = resp.headers.get("content-type", "").split(";")[0].strip()
        u = resp.url
        ext = os.path.splitext(urlparse(u).path)[1].lower()
        if ct in IMAGE_TYPES or ext in IMAGE_EXTS:
            try:
                body = await resp.body()
                if len(body) > 100: intercepted[u] = body
            except Exception: pass

    page.on("response", on_resp)
    print(f"\n  Loading wallet: {url}")
    try:
        await page.goto(url, wait_until="networkidle", timeout=60000)
    except Exception as e:
        print(f"  WARNING: {e}")

    await page.wait_for_timeout(4000)
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    await page.wait_for_timeout(3000)
    await page.evaluate("window.scrollTo(0, 0)")
    await page.wait_for_timeout(2000)

    ss = os.path.join(save_dir, "screenshot.png")
    await page.screenshot(path=ss, full_page=True)

    meta = await page.evaluate("""() => {
        const t = s => (document.querySelector(s)||{}).textContent || '';
        const a = s => (document.querySelector(s)||{}).getAttribute?.('content') || '';
        const creds = [...document.querySelectorAll('[class*="credential"], [class*="badge"], [class*="cert"]')].map(el => ({
            text: el.textContent.trim().slice(0, 200),
            tag: el.tagName,
        }));
        return {
            title:    a('meta[property="og:title"]') || document.title,
            og_image: a('meta[property="og:image"]'),
            all_imgs: [...document.querySelectorAll('img[src]')].map(i => i.src).filter(s => !s.startsWith('data:')),
            badge_imgs: [...document.querySelectorAll('img')].filter(i => i.width > 60).map(i => ({ src: i.src, alt: i.alt, w: i.width, h: i.height })),
        };
    }""")

    with open(os.path.join(save_dir, "meta.json"), "w", encoding="utf-8") as f:
        json.dump({"slug": slug, "url": url, "meta": meta}, f, indent=2)

    await ctx.close()

    saved = []
    import requests
    sess = requests.Session()
    sess.headers["User-Agent"] = "Mozilla/5.0"
    sess.headers["Referer"] = url

    for idx, (img_url, body) in enumerate(intercepted.items(), 1):
        fname = safe_fname(img_url, idx)
        fpath = os.path.join(save_dir, fname)
        with open(fpath, "wb") as f: f.write(body)
        size = os.path.getsize(fpath)
        if size < 50: os.remove(fpath); continue
        saved.append(fname)
        print(f"    [img] {fname}  ({size:,}b)")

    print(f"  => {len(saved)} images saved to wallet_{slug}/")
    return {"slug": slug, "save_dir": save_dir, "meta": meta, "files": saved}

async def main():
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for w in WALLETS:
            r = await scrape(browser, w)
            results.append(r)
        await browser.close()
    with open(os.path.join(SAVE_ROOT, "wallets.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\n=== Wallet scrape done. ===")

asyncio.run(main())
