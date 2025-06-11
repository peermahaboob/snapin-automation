const { BasePage } = require("./base-page");
class SnapinInstalledPage extends BasePage {
  constructor(page) {
    super(page);
    this.azureboardInstalled = page.getByRole("link", {
      name: "Azure Boards Azure Boards",
    });

    this.notionAppInstalled = page.getByRole("link", {
      name: "Notion Airdrop (Beta) Notion",
    });
  }

  async navigate() {
    await this.page.goto(process.env.URL + process.env.SNAPIN_DEEPLINK_URL);
  }

  async clickAzureBoardSnapin() {
    await this.azureboardInstalled.click();
  }

  async clickNotionSnapin() {
    await this.notionAppInstalled.click();
  }
}

module.exports = { SnapinInstalledPage };
