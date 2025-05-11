const{BasePage} = require('./base-page');
class SnapinInstalledPage extends BasePage{
  constructor(page) {
    super(page)
    this.snapinAppInstalled = page.locator(
      '//div[contains(@class, "text-default-medium") and contains(text(), "Azure Boards")]'
    );
    this.notionAppInstalled = page.getByRole("link", {
      name: "Notion Airdrop (Beta) Notion",
    });
  }

  async navigate() {
    await this.page.goto(process.env.URL + process.env.SNAPIN_DEEPLINK_URL);
  }

  async clickAzureBoardSnapin() {
    await this.snapinAppInstalled.click();
  }

  async clickNotionSnapin() {
    await this.notionAppInstalled.click();
  }
}

module.exports = { SnapinInstalledPage };
