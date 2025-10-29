from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:5173/templates/new")

    page.get_by_label("قالب اطلاعاتی محصول").fill("کالای دیجیتال")
    page.get_by_role("option", name="کالای دیجیتال").click()

    page.get_by_role("button", name="ذخیره قالب ویژگی ها").click()

    page.screenshot(path="jules-scratch/verification/validation.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
