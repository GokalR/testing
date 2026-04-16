"""
Yandex Maps parser for Samarkand region.

Requirements:
    pip install selenium webdriver-manager

Usage:
    python yandex_maps_parser.py
"""

import csv
import time
from dataclasses import dataclass, asdict
from typing import List

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException


REGION_ID = 105814
REGION_SLUG = "fergana-province"
BASE_URL = "https://yandex.uz/maps/{region_id}/{region_slug}/search/{query}/"


@dataclass
class Place:
    name: str
    category: str
    address: str
    rating: str
    reviews: str
    phone: str
    url: str


def build_driver(headless: bool = True) -> webdriver.Chrome:
    opts = Options()
    if headless:
        opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--disable-blink-features=AutomationControlled")
    opts.add_argument("--window-size=1400,900")
    opts.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    )
    return webdriver.Chrome(options=opts)


def safe_text(el, css: str) -> str:
    try:
        return el.find_element(By.CSS_SELECTOR, css).text.strip()
    except NoSuchElementException:
        return ""


def scroll_results(driver, max_scrolls: int = 30, pause: float = 1.5) -> None:
    """Scroll the left results pane until no new items load."""
    container_sel = "div.scroll__container, ._name_scroll"
    try:
        container = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, container_sel))
        )
    except TimeoutException:
        return

    last_count = 0
    for _ in range(max_scrolls):
        driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight;", container)
        time.sleep(pause)
        items = driver.find_elements(By.CSS_SELECTOR, "div.search-snippet-view")
        if len(items) == last_count:
            # try a bit more; sometimes loading is slow
            time.sleep(pause)
            items = driver.find_elements(By.CSS_SELECTOR, "div.search-snippet-view")
            if len(items) == last_count:
                break
        last_count = len(items)


def parse_item(el) -> Place:
    name = safe_text(el, ".search-business-snippet-view__title")
    category = safe_text(el, ".search-business-snippet-view__category")
    address = safe_text(el, ".search-business-snippet-view__address")
    rating = safe_text(el, ".business-rating-badge-view__rating-text")
    reviews = safe_text(el, ".business-rating-amount-view")
    phone = safe_text(el, ".search-business-snippet-view__phone")
    url = ""
    try:
        url = el.find_element(By.CSS_SELECTOR, "a.link-overlay").get_attribute("href") or ""
    except NoSuchElementException:
        pass
    return Place(name, category, address, rating, reviews, phone, url)


def parse_query(query: str, headless: bool = True, max_scrolls: int = 30) -> List[Place]:
    url = BASE_URL.format(region_id=REGION_ID, region_slug=REGION_SLUG, query=query)
    driver = build_driver(headless=headless)
    try:
        driver.get(url)
        try:
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div.search-snippet-view"))
            )
        except TimeoutException:
            shot = f"debug_{query}.png"
            html = f"debug_{query}.html"
            driver.save_screenshot(shot)
            with open(html, "w", encoding="utf-8") as f:
                f.write(driver.page_source)
            print(f"    timeout — current URL: {driver.current_url}")
            print(f"    title: {driver.title}")
            print(f"    saved {shot} and {html} for inspection")
            raise
        scroll_results(driver, max_scrolls=max_scrolls)
        items = driver.find_elements(By.CSS_SELECTOR, "div.search-snippet-view")
        return [parse_item(it) for it in items]
    finally:
        driver.quit()


def save_csv(places: List[Place], path: str) -> None:
    with open(path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(Place.__annotations__.keys()))
        writer.writeheader()
        for p in places:
            writer.writerow(asdict(p))


if __name__ == "__main__":
    queries = ["рестораны", "кафе", "банки", "отели"]
    all_places: List[Place] = []
    for q in queries:
        print(f"[+] Parsing '{q}' ...")
        try:
            results = parse_query(q, headless=True)
            print(f"    found {len(results)}")
            all_places.extend(results)
        except Exception as e:
            print(f"    failed: {e}")

    out = f"{REGION_SLUG}_yandex_maps.csv"
    save_csv(all_places, out)
    print(f"[+] Saved {len(all_places)} rows -> {out}")
