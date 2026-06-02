import asyncio, os, re, json, requests
from playwright.async_api import async_playwright
from urllib.parse import urlparse

SAVE_ROOT = r"G:\Draft\Sahathika\cert_images"

CREDENTIALS = [
    {"uuid": "15172f35-44b0-45c0-b9bc-ea122c51307f"},
    {"uuid": "3873ff06-43e5-4054-9c48-a0b2fc783685"},
    {"uuid": "7662e615-9dc2-41b1-8000-f213dfecc53d"},
    {"uuid": "d47f0b7b-cb87-4dc3-b4ea-498df7fa07aa"},
    {"uuid": "2c262235-047f-40a1-a63a-e8422993bc8e"},
    {"uuid": "5288c26e-cd38-47c1-b036-eaa1ed04cc92"},
]

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"}
IMAGE_TYPES = {"image/png","image/jpeg","image/gif","image/svg+xml","image/webp","image/x-icon"}

def safe_fname(url, idx):
    path = urlparse(url).path
    ext = os.path.splitext(path)[1].lower()
    if ext not in IMAGE_EXTS:
        ext = ".png"
    base = re.sub(r"[^\w\-]", "_", os.path.basename(path))
    base = base[:60] or f"img_{idx}"
    if not base.endswith(ext):
        base += ext
    return f"{idx:03d}_{base}"

async def scrape_credential(browser, cred):
    uuid = cred["uuid"]
    url = f"https://www.credential.net/{uuid}"
    save_dir = os.path.join(SAVE_ROOT, uuid)
    os.makedirs(save_dir, exist_ok=True)

    context = await browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36",
        viewport={"width": 1280, "height": 900},
    )
    page = await context.new_page()

    intercepted = {}

    async def on_response(resp):
        ct = resp.headers.get("content-type", "").split(";")[0].strip()
        u = resp.url
        ext = os.path.splitext(urlparse(u).path)[1].lower()
        if ct in IMAGE_TYPES or ext in IMAGE_EXTS:
            try:
                body = await resp.body()
                if len(body) > 100:
                    intercepted[u] = body
            except Exception:
                pass

    page.on("response", on_response)

    print(f"\n  Loading {url} ...")
    try:
        await page.goto(url, wait_until="networkidle", timeout=60000)
    except Exception as e:
        print(f"  WARNING: {e}")

    await page.wait_for_timeout(4000)
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    await page.wait_for_timeout(2000)
    await page.evaluate("window.scrollTo(0, 0)")
    await page.wait_for_timeout(2000)

    # Screenshot
    ss = os.path.join(save_dir, "screenshot.png")
    await page.screenshot(path=ss, full_page=True)

    # Extract text metadata from rendered DOM
    meta = await page.evaluate("""() => {
        const t = s => (document.querySelector(s)||{}).textContent || '';
        const a = s => (document.querySelector(s)||{}).getAttribute?.('content') || '';
        return {
            title:       t('h1') || t('.credential-title') || t('[class*="title"]'),
            issuer:      t('[class*="issuer"]') || t('[class*="organization"]'),
            issued_on:   t('[class*="issued"]') || t('[class*="date"]'),
            description: a('meta[name="description"]') || t('[class*="description"]'),
            og_image:    a('meta[property="og:image"]'),
            og_title:    a('meta[property="og:title"]'),
            og_desc:     a('meta[property="og:description"]'),
        };
    }""")

    # Also grab canvas data URLs
    canvases = await page.evaluate("""() => {
        return [...document.querySelectorAll('canvas')].map(c => {
            try { return c.toDataURL('image/png'); } catch(e) { return null; }
        }).filter(Boolean);
    }""")

    await context.close()

    # Save canvas images
    import base64
    for i, data_url in enumerate(canvases):
        m = re.match(r"data:image/(\w+);base64,(.*)", data_url, re.DOTALL)
        if m:
            ext2, b64 = m.group(1), m.group(2)
            fpath = os.path.join(save_dir, f"canvas_{i:02d}.{ext2}")
            with open(fpath, "wb") as f:
                f.write(base64.b64decode(b64))
            print(f"    [canvas] canvas_{i:02d}.{ext2}")

    # Save intercepted images
    saved_files = []
    for idx, (img_url, body) in enumerate(intercepted.items(), 1):
        fname = safe_fname(img_url, idx)
        fpath = os.path.join(save_dir, fname)
        with open(fpath, "wb") as f:
            f.write(body)
        size = os.path.getsize(fpath)
        print(f"    [img] {fname}  ({size:,}b)")
        saved_files.append({"file": fname, "url": img_url, "size": size})

    # Identify badge and certificate images (largest non-photo images)
    sorted_by_size = sorted(saved_files, key=lambda x: x["size"], reverse=True)

    # Persist metadata
    result = {
        "uuid": uuid,
        "url": url,
        "screenshot": "screenshot.png",
        "meta": meta,
        "images": saved_files,
        "largest_images": [x["file"] for x in sorted_by_size[:5]],
    }
    with open(os.path.join(save_dir, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    print(f"    => {len(saved_files)} images, screenshot saved")
    return result


async def main():
    os.makedirs(SAVE_ROOT, exist_ok=True)
    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for cred in CREDENTIALS:
            r = await scrape_credential(browser, cred)
            results.append(r)
        await browser.close()

    # Save master index
    with open(os.path.join(SAVE_ROOT, "all_creds.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\n=== All done. {len(results)} credentials scraped. ===")

asyncio.run(main())
