import { SnapInNewConnectionPage } from "./snap-in-new-connection-page";
import { faker } from "@faker-js/faker";
const { BasePage } = require("./base-page");

class SnapInConfigPage extends BasePage {
  constructor(page) {
    super(page);
    this.buttonStartAirdrop = page.getByRole("button", {
      name: "Start Airdrop",
    });

    this.buttonAzureBoardSnapin = page.getByRole("button", {
      name: "Azure Boards",
    });

    this.selectConnection = page.getByRole("button", {
      name: "Select connection",
    });
    this.selectNewConnection = page.locator(
      '//div[contains(text(),"Add connection")]'
    );
    this.AddNewConnection = page.locator(
      '//button[normalize-space()="Add connection"]'
    );
    this.selectAzureboardConnection = page.locator(
      '//div[@class="flex items-center gap-2"]'
    );
    this.selectAzureboardConnection = page.getByText("Azure Boards");
    this.buttonNotionSnapin = page.getByRole("button", {
      name: "Notion Notion",
    });
    this.selectNotion = page
      .getByRole("menuitemradio", { name: "Notion" })
      .locator("div")
      .first();
  }

  async startAirdrop() {
    await this.buttonStartAirdrop.click();
  }

  async azureBoardSnapin() {
    await this.buttonAzureBoardSnapin.click();
  }

  async notionSnapin() {
    await this.buttonNotionSnapin.click();
  }

  async selectAzureBoardConnection(datasource, partName) {
    await this.selectConnection.click();
    if (await this.selectNewConnection.isVisible()) {
      await this.selectNewConnection.click();
    } else if (await this.AddNewConnection.isVisible()) {
      await this.AddNewConnection.click();
    }
    await this.selectConnection.click();
    await this.selectAzureboardConnection.click();
    const azureBoardNewConnection = new SnapInNewConnectionPage(this.page);
    await azureBoardNewConnection.fillAzureboardConnectionDetails(
      faker.lorem.words(2),
      datasource,
      partName
    );
  }

  async createNotionConnection(notionConnectionname) {
    await this.selectConnection.click();
    if (await this.selectNewConnection.isVisible()) {
      await this.selectNewConnection.click();
    } else if (await this.AddNewConnection.isVisible()) {
      await this.AddNewConnection.click();
    }
    await this.selectConnection.click();
    await this.selectNotion.click();
    const azureBoardNewConnection = new SnapInNewConnectionPage(this.page);
    await azureBoardNewConnection.newNotionConnection(notionConnectionname);
  }

  async selectNotionConnection(notionConnectionname, workspaceName, partName) {
    await this.selectConnection.click();
    await this.page.getByText(notionConnectionname).click();
    await this.page.getByRole("button", { name: "Next" }).click();
    const azureBoardNewConnection = new SnapInNewConnectionPage(this.page);
    await azureBoardNewConnection.selectNotionWorkspace(
      workspaceName,
      partName
    );
  }
}

module.exports = { SnapInConfigPage };
