import { expect } from "@playwright/test";
import { getIntegrationDetails } from "../../utils/file-utils";
import { NotionOauthPage } from "../third_party/notion-oauth-page";
const { BasePage } = require("./base-page");

class SnapInNewConnectionPage extends BasePage {
  constructor(page) {
    super(page);
    // Locators
    this.makePublicToggle = page.locator(
      'button[role="switch"][value="scope"]'
    );
    this.connectionNameInput = page.locator('input[name="connection_name"]');
    this.subdomainInput = page.locator('input[name="subdomain"]');
    this.usernameInput = page.locator('input[name="username"]');
    this.tokenInput = page.locator('input[name="token"]');
    this.cancelButton = page.locator(
      'button[data-drid="create_connection_modal--cancel"]'
    );
    this.nextButton = page.locator(
      'button[data-drid="create_connection_modal--connect"]'
    );
    this.inputSourceName = page.locator('//input[@placeholder="Search"]');
    this.sourceSelectGrid = page.locator(
      '[data-drid="integrations--select-external-sync-unit-table"]'
    );
    this.selectSource = page.locator(
      '//div[@class="ag-cell ag-cell-not-inline-editing ag-cell-normal-height ag-column-first"]'
    );
    this.clickPart = page.locator('//div[contains(text(),"Select part")]');
    this.selectPart = page.locator(
      '//span[normalize-space()="testingUserjourney"]'
    );
    this.clickStart = page.locator('//button[normalize-space()="Start"]');
    this.clickMapping = page.locator(
      '//button[normalize-space()="Map fields"]'
    );
    this.clickNextSelectObject = page.locator(
      '//button[normalize-space()="Next"]'
    );
    this.clickNextFilters = page.locator('//button[normalize-space()="Next"]');
    this.clickNextMapObject = page.locator(
      '//button[normalize-space()="Next"]'
    );
    this.clickNextMapFields = page.locator(
      '//button[normalize-space()="Next"]'
    );
    this.clickNextCustomeFiels = page.locator(
      '//button[normalize-space()="Finish"]'
    );
    this.toggleMakePublic = page.getByRole("switch");
    this.notionConnectionName = page.getByRole("textbox", {
      name: "Connection name *",
    });
    this.selectConnectionType = page.getByRole("tab", {
      name: "OAuth Connection",
    });
    this.signinWithSnapin = page.getByRole("button", {
      name: "Sign in with Snap-ins",
    });
  }
  async toggleMakePublic() {
    await this.makePublicToggle.click();
  }

  // Fill the connection name
  async fillConnectionName(name) {
    await this.connectionNameInput.fill(name);
  }

  // Fill the subdomain
  async fillSubdomain(subdomain) {
    await this.subdomainInput.fill(subdomain);
  }

  // Fill the username
  async fillUsername(username) {
    await this.usernameInput.fill(username);
  }

  // Fill the token
  async fillToken(token) {
    await this.tokenInput.fill(token);
  }

  // Click the Cancel button
  async clickCancel() {
    await this.cancelButton.click();
  }

  // Click the Next button (if enabled)
  async clickNext() {
    await expect(this.nextButton).toBeEnabled(); // Ensure the button is enabled
    await this.nextButton.click();
  }

  // Check if the Next button is disabled
  async isNextButtonDisabled() {
    return await this.nextButton.isDisabled();
  }

  async notionMakeToggelPublic() {
    await this.toggleMakePublic.click();
  }

  async notionFillConnectionName(connectionName) {
    await this.notionConnectionName.fill(connectionName);
  }

  async notionSelectConnectionType() {
    this.selectConnectionType.click();
  }

  async notionSigninWithSnapin() {
    await this.signinWithSnapin.click();
  }

  async fillAzureboardConnectionDetails(connectionName, datasource, partname) {
    const getIntegrationdetail = getIntegrationDetails("azureboard");
    await this.fillConnectionName(connectionName);
    await this.fillSubdomain((await getIntegrationdetail).subdomain);
    await this.fillUsername((await getIntegrationdetail).username);
    await this.fillToken((await getIntegrationdetail).token);
    await this.clickNext();
    await this.sourceSelectGrid.waitFor({ state: "visible" });
    await this.inputSourceName.fill(datasource);
    await this.page.waitForTimeout(3000);
    await this.page
      .locator(
        `//div[@class="text-color-primary text-small truncate" and text()="${datasource}"]`
      )
      .click();
    await this.clickPart.click();
    await this.page.locator(`//span[normalize-space()="${partname}"]`).click();
    await this.clickStart.click();
  }

  async notionSigninWithSnapin() {
    const popupPromise = this.page.waitForEvent("popup");
    await this.page
      .getByRole("button", { name: "Sign in with Snap-ins" })
      .click();
    const popupPage = await popupPromise;
    return new NotionOauthPage(popupPage);
  }

  async newNotionConnection(connectionName) {
    const getIntegrationdetail = getIntegrationDetails("notion");
    await this.notionMakeToggelPublic();
    await this.fillConnectionName(connectionName);
    await this.notionSelectConnectionType();
    //await this.notionSigninWithSnapin();
    const notionAuthPage = await this.notionSigninWithSnapin();
    await notionAuthPage.login(
      (
        await getIntegrationdetail
      ).email,
      (
        await getIntegrationdetail
      ).password
    );
    await notionAuthPage.selectWorkspace(
      (
        await getIntegrationdetail
      ).workspace
    );
    await notionAuthPage.allowAccess((await getIntegrationdetail).workspace);
  }

  async selectNotionWorkspace(workspaceName, partName) {
    await this.page
      .getByText("There are no projects")
      .waitFor({ state: "visible", timeout: 60000 });
    await this.inputSourceName.fill(workspaceName);
    await this.page.waitForTimeout(3000);
    /*await this.page
      .locator(
        `//div[@class="text-color-primary text-small truncate" and text()="${workspaceName}"]`
      )
      .click();*/
    await this.page.getByText(workspaceName).click();
    await this.clickPart.click();
    /*await this.page.locator(`//span[normalize-space()="${partName}"]`).click();*/
    await this.page.getByText(partName).click();
    await this.clickStart.click();
  }

  async updateMissingMappingsToBacklog() {
    
    await this.page.waitForSelector('span.input-base_select-value__JmDg9', { timeout: 10000 });
  
    const spans = await this.page.$$(`span.input-base_select-value__JmDg9`);
  
    for (const span of spans) {
      const text = await span.textContent();
  
      if (text?.trim() === 'Missing mapping') {
        try {
          const dropdown = await span.evaluateHandle(el => el.closest('div[role="button"]'));
          if (!dropdown) continue;
  
          const box = await dropdown.boundingBox();
          if (!box) continue;
  
    
          await dropdown.scrollIntoViewIfNeeded();
          await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await this.page.mouse.down();
          await this.page.mouse.up();
  
    
          await this.page.waitForSelector('[role="menuitemradio"]', { timeout: 3000 });
          await this.page.getByRole('menuitemradio', { name: 'Backlog' }).locator('div').click();
  
          
          await this.page.waitForFunction(
            (el) => el.textContent?.trim() === 'Backlog',
            span,
            { timeout: 3000 }
          );
  
    
          await this.page.waitForTimeout(200);
        } catch (_) {
          await this.page.keyboard.press('Escape');
        }
      }
    }
  }
  

  async mapFields() {
    //await this.page.goto('https://app.devrev.ai/test-demo1/settings/airdrops');
    await this.clickMapping.click();
    await this.clickNextSelectObject.click();
    await this.clickNextFilters.click();
    await this.clickNextMapObject.click();
    await this.updateMissingMappingsToBacklog();
    await this.clickNextMapObject.click();
    await this.clickNextCustomeFiels.click();
  }
}

module.exports = { SnapInNewConnectionPage };
