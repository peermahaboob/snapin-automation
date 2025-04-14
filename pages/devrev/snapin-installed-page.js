class SnapinInstalledPage {
  constructor(page) {
    this.page = page;
    this.snapinAppInstalled = page.locator(
      '//div[contains(@class, "text-default-medium") and contains(text(), "Azure Boards")]'  
    );
  }

  async navigate() {
    await this.page.goto(process.env.URL+process.env.SNAPIN_DEEPLINK_URL);
}

  async clickAzureBoardSnapin() {
    await this.snapinAppInstalled.click();
  }
}

module.exports = { SnapinInstalledPage };
