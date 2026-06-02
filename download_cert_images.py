import requests
import cloudscraper
import os
import re
import json
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

SAVE_DIR = r"G:\Draft\Sahathika\cert_images"
CREDENTIAL_URL = "https://www.credential.net/d47f0b7b-cb87-4dc3-b4ea-498df7fa07aa"
CREDENTIAL_UUID = "d47f0b7b-cb87-4dc3-b4ea-498df7fa07aa"
API_URL = f"https://api.accredible.com/v1/credential/{CREDENTIAL_UUID}"

os.makedirs(SAVE_DIR, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

downloaded = []
image_urls = set()


def safe_filename(url, index):
    path = urlparse(url).path
    ext = os.path.splitext(path)[1]
    if not ext or len(ext) > 5:
        ext = ".png"
    name = re.sub(r"[^\w\-.]", "_", os.path.basename(path))
    if not name or name == ext:
        name = f"image_{index}"
    return f"{index:03d}_{name}{ext if not name.endswith(ext) else ''}"


def download_image(url, filename):
    try:
        r = requests.get(url, headers=headers, timeout=20, stream=True)
        if r.status_code == 200 and "image" in r.headers.get("Content-Type", ""):
            path = os.path.join(SAVE_DIR, filename)
            with open(path, "wb") as f:
                for chunk in r.iter_content(8192):
                    f.write(chunk)
            size = os.path.getsize(path)
            print(f"  [OK] {filename}  ({size:,} bytes)")
            downloaded.append(path)
            return True
        else:
            print(f"  [SKIP] {url} — status {r.status_code} / type {r.headers.get('Content-Type','?')}")
    except Exception as e:
        print(f"  [ERR] {url} — {e}")
    return False


# ── 1. Try Accredible public API ──────────────────────────────────────────────
print("\n=== Accredible API ===")
try:
    r = requests.get(API_URL, headers={**headers, "Accept": "application/json"}, timeout=15)
    print(f"API status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        with open(os.path.join(SAVE_DIR, "_api_response.json"), "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print("  Saved _api_response.json")

        def find_urls(obj, depth=0):
            if depth > 10:
                return
            if isinstance(obj, str) and re.match(r"https?://", obj):
                if any(x in obj.lower() for x in [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", "image", "badge", "certificate", "logo"]):
                    image_urls.add(obj)
            elif isinstance(obj, dict):
                for v in obj.values():
                    find_urls(v, depth + 1)
            elif isinstance(obj, list):
                for item in obj:
                    find_urls(item, depth + 1)

        find_urls(data)
        print(f"  Found {len(image_urls)} image URLs in API response")
    else:
        print(f"  API returned: {r.text[:300]}")
except Exception as e:
    print(f"  API error: {e}")


# ── 2. Scrape page HTML with cloudscraper ─────────────────────────────────────
print("\n=== Fetching page HTML ===")
try:
    scraper = cloudscraper.create_scraper()
    r = scraper.get(CREDENTIAL_URL, headers=headers, timeout=20)
    print(f"Page status: {r.status_code}")
    soup = BeautifulSoup(r.text, "html.parser")

    # Save raw HTML for inspection
    with open(os.path.join(SAVE_DIR, "_page.html"), "w", encoding="utf-8") as f:
        f.write(r.text)
    print("  Saved _page.html")

    # img tags
    for tag in soup.find_all("img"):
        src = tag.get("src") or tag.get("data-src") or tag.get("data-lazy-src")
        if src:
            image_urls.add(urljoin(CREDENTIAL_URL, src))

    # og:image / twitter:image meta
    for tag in soup.find_all("meta"):
        content = tag.get("content", "")
        if content and re.match(r"https?://", content) and any(
            x in content.lower() for x in [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"]
        ):
            image_urls.add(content)

    # background-image in style attributes
    for tag in soup.find_all(style=True):
        matches = re.findall(r'url\(["\']?(https?://[^"\')\s]+)["\']?\)', tag["style"])
        image_urls.update(matches)

    # CSS files
    for link in soup.find_all("link", rel=lambda r: r and "stylesheet" in r):
        href = link.get("href")
        if href:
            try:
                css = scraper.get(urljoin(CREDENTIAL_URL, href), timeout=10).text
                matches = re.findall(r'url\(["\']?(https?://[^"\')\s]+)["\']?\)', css)
                image_urls.update(m for m in matches if any(
                    x in m.lower() for x in [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", "badge", "cert"]
                ))
            except Exception:
                pass

    # Inline JSON blobs (Angular transfer state)
    for script in soup.find_all("script"):
        text = script.get_text()
        urls = re.findall(r'"(https?://[^"]+\.(?:png|jpg|jpeg|gif|svg|webp)[^"]*)"', text)
        image_urls.update(urls)

    print(f"  Found {len(image_urls)} unique image URLs after HTML parse")
except Exception as e:
    print(f"  Scrape error: {e}")


# ── 3. Try known Accredible image endpoints ───────────────────────────────────
print("\n=== Trying known Accredible image endpoints ===")
known = [
    f"https://api.accredible.com/v1/credential/{CREDENTIAL_UUID}/certificate",
    f"https://cdn.accredible.com/credentials/{CREDENTIAL_UUID}/certificate.png",
    f"https://cdn.accredible.com/credentials/{CREDENTIAL_UUID}/badge.png",
]
for url in known:
    image_urls.add(url)


# ── 4. Download everything ────────────────────────────────────────────────────
print(f"\n=== Downloading {len(image_urls)} images ===")
for i, url in enumerate(sorted(image_urls)):
    fname = safe_filename(url, i + 1)
    download_image(url, fname)


# ── 5. Summary ────────────────────────────────────────────────────────────────
print(f"\n=== Done: {len(downloaded)} files saved to {SAVE_DIR} ===")
for p in downloaded:
    print(f"  {os.path.basename(p)}")
