import asyncio, os, re, requests
from playwright.async_api import async_playwright

URL = "https://www.credential.net/d47f0b7b-cb87-4dc3-b4ea-498df7fa07aa"
SAVE_DIR = r"G:\Draft\Sahathika\cert_images"
os.makedirs(SAVE_DIR, exist_ok=True)

intercepted = {}   # url -> bytes

def safe_name(url, idx):
    from urllib.parse import urlparse
    path = urlparse(url).path
    ext = os.path.splitext(path)[1]
    if not ext or len(ext) > 6:
        ext = ".png"
    base = re.sub(r"[^\w\-]", "_", path.strip("/").replace("/", "_"))[-60:] or f"img_{idx}"
    return f"{idx:03d}_{base}{'' if base.endswith(ext) else ext}"

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36",
            viewport={"width": 1280, "height": 900},
        )
        page = await context.new_page()

        # Intercept every response that looks like an image
        async def handle_response(response):
            ct = response.headers.get("content-type", "")
            url = response.url
            if any(x in ct for x in ["image/", "svg"]) or any(
                url.lower().endswith(x) for x in [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"]
            ):
                try:
                    body = await response.body()
                    intercepted[url] = body
                    print(f"  [capture] {url[-80:]}  ({len(body):,}b)")
                except Exception:
                    pass

        page.on("response", handle_response)

        print(f"Loading {URL} ...")
        await page.goto(URL, wait_until="networkidle", timeout=60000)

        # Extra wait for lazy-loaded images
        await page.wait_for_timeout(4000)

        # Scroll to trigger lazy loading
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(2000)
        await page.evaluate("window.scrollTo(0, 0)")
        await page.wait_for_timeout(2000)

        # ── Take a full-page screenshot ──────────────────────────────────────
        ss_path = os.path.join(SAVE_DIR, "000_screenshot_fullpage.png")
        await page.screenshot(path=ss_path, full_page=True)
        print(f"\n  [screenshot] {ss_path}")

        # ── Extract all image src / background-image from DOM ────────────────
        dom_urls = await page.evaluate("""() => {
            const urls = new Set();
            document.querySelectorAll('img[src]').forEach(el => urls.add(el.src));
            document.querySelectorAll('img[data-src]').forEach(el => urls.add(el.dataset.src));
            document.querySelectorAll('[style]').forEach(el => {
                const m = el.style.backgroundImage.match(/url\\(["']?([^"')]+)["']?\\)/);
                if (m) urls.add(m[1]);
            });
            // canvas elements (certificate renderer)
            document.querySelectorAll('canvas').forEach(el => {
                try { urls.add(el.toDataURL()); } catch(e) {}
            });
            return [...urls].filter(u => u && !u.startsWith('data:,'));
        }""")

        print(f"\nDOM image URLs found: {len(dom_urls)}")
        for u in dom_urls:
            if u.startswith("data:"):
                # Save inline data URL directly
                import base64
                m = re.match(r"data:image/(\w+);base64,(.*)", u, re.DOTALL)
                if m:
                    ext, b64 = m.group(1), m.group(2)
                    fname = f"canvas_{len(intercepted):03d}.{ext}"
                    fpath = os.path.join(SAVE_DIR, fname)
                    with open(fpath, "wb") as f:
                        f.write(base64.b64decode(b64))
                    print(f"  [canvas] {fname}")
            else:
                intercepted.setdefault(u, None)

        await browser.close()

    # ── Save all intercepted images ──────────────────────────────────────────
    print(f"\n=== Saving {len(intercepted)} captured resources ===")
    saved = []
    sess = requests.Session()
    sess.headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    sess.headers["Referer"] = URL

    for idx, (url, body) in enumerate(intercepted.items(), 1):
        fname = safe_name(url, idx)
        fpath = os.path.join(SAVE_DIR, fname)
        if body:
            with open(fpath, "wb") as f:
                f.write(body)
        else:
            # Try fetching now with Referer
            try:
                r = sess.get(url, timeout=15)
                if r.status_code == 200:
                    with open(fpath, "wb") as f:
                        f.write(r.content)
                    body = r.content
                else:
                    print(f"  [skip] {url[-60:]} — {r.status_code}")
                    continue
            except Exception as e:
                print(f"  [err] {url[-60:]} — {e}")
                continue
        size = os.path.getsize(fpath)
        if size < 50:          # skip empty/trivial files
            os.remove(fpath)
            continue
        saved.append(fname)
        print(f"  [saved] {fname}  ({size:,}b)")

    print(f"\n=== Done — {len(saved)} images saved to {SAVE_DIR} ===")

asyncio.run(run())
