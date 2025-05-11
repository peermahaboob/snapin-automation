import { expect, test, request as playwrightRequest } from "@playwright/test";
import { SnapinInstalledPage } from "../../pages/devrev/snapin-installed-page";
import { AzureBoardConfigPage } from "../../pages/devrev/azure-board-config-page";
import { AzureBoardNewConnectionPage } from "../../pages/devrev/azure-board-new-connection-page";
import * as devrevApiUtils from "../../utils/devrev-api-utils";
import { faker } from "@faker-js/faker";
import { waitForState } from "../../utils/helper-utils";
import { DevrevAPI } from "../../utils/api-utils-new";
import { NotionOauthPage } from "../../pages/third_party/notion-oauth-page";

test.describe.serial("Azureboard Snapin Tests", () => {
  const workspaceName = "Mahaboob Peer’s Workspace";
  const notionConnectionname = faker.lorem.words(2);
  const expectedWorklistCount = 22;
  const delayInterval = 5000;
  const testData = require("../../test_data/azure_board/ticketing_testdata.json");
  let partID = null;
  let devrevAPI;
  let apiContext;

  test.beforeAll(async () => {
    apiContext = await playwrightRequest.newContext();
    devrevAPI = new DevrevAPI(apiContext);
    await devrevAPI.deleteKeyrings();
    await devrevAPI.deleteAirdrop();
  });

  test("Configure azureboard snapin", async ({ page }) => {
    //test.slow();
    const partName = faker.lorem.word();
    const userId = await devrevAPI.getUserIdByEmail(process.env.DEVREV_USERID);
    partID = await devrevAPI.createPartByOwnerID(userId, partName);

    console.log("partID is ", partID);

    const snapinInstalledPage = new SnapinInstalledPage(page);
    const azureBoardConfigPage = new AzureBoardConfigPage(page);
    const azureBoardNewConnectionPage = new AzureBoardNewConnectionPage(page);

    await snapinInstalledPage.navigate();
    await snapinInstalledPage.clickAzureBoardSnapin();
    await azureBoardConfigPage.startAirdrop();
    await azureBoardConfigPage.notionSnapin();
    await azureBoardConfigPage.createNotionConnection(notionConnectionname);
    await azureBoardConfigPage.startAirdrop();
    await azureBoardConfigPage.notionSnapin();
    await azureBoardConfigPage.selectNotionConnection(
      notionConnectionname,
      workspaceName,
      partName
    );

    await waitForState(
      apiContext,
      workspaceName,
      process.env.MAPPING_STATE,
      delayInterval
    );
    await azureBoardNewConnectionPage.mapFields();
    await waitForState(
      apiContext,
      workspaceName,
      process.env.SYNCCOMPLETED_STATE,
      delayInterval
    );
  });

  test("Validate sync data", async () => {
    const responseBody = await devrevAPI.airdropSyncHistory();

    const destinationItems =
      responseBody.sync_history[0].sync_run.report.destination_items;

    const typesToValidate = [
      { type: "users", expectedCount: 1 },
      { type: "articles", expectedCount: 2 },
      { type: "attachments", expectedCount: 0 },
    ];

    typesToValidate.forEach(({ type, expectedCount }) => {
      const item = destinationItems.find((item) => item.type === type);

      expect(item).toBeDefined();

      expect(item.count).toBe(expectedCount);

      console.log(`Validated ${type} count: ${item.count}`);
    });
  });

  test.afterAll(async () => {
    if (partID) await devrevAPI.deletePartbyID(partID);
    await apiContext.dispose();
  });
});
