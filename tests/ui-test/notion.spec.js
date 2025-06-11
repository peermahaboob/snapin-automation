import { expect, test, request as playwrightRequest } from "@playwright/test";
import { SnapinInstalledPage } from "../../pages/devrev/snapin-installed-page";
import { SnapInConfigPage } from "../../pages/devrev/snap-in-config-page";
import { SnapInNewConnectionPage } from "../../pages/devrev/snap-in-new-connection-page";
import { faker } from "@faker-js/faker";
import { waitForState } from "../../utils/helper-utils";
import { DevrevAPI } from "../../utils/api-utils-new";
import { getIntegrationDetails } from "../../utils/file-utils";

test.describe.serial("Notion Snapin Tests", async () => {
  const getIntegrationdetail = getIntegrationDetails("notion");
  const workspace = (await getIntegrationdetail).workspace;
  const notionConnectionname = faker.lorem.words(2);
  const delayInterval = 5000;
  const testData = require("../../test_data/notion/validation_testdata.json");
  let partID = null;
  let devrevAPI;
  let apiContext;

  test.beforeAll(async () => {
    apiContext = await playwrightRequest.newContext();
    devrevAPI = new DevrevAPI(apiContext);
    await devrevAPI.deleteKeyrings();
    await devrevAPI.deleteAirdrop();
  });

  test("Configure notion snapin", async ({ page }) => {
    test.slow();
    const partName = faker.lorem.word();
    const userId = await devrevAPI.getUserIdByEmail(process.env.DEVREV_USERID);
    partID = await devrevAPI.createPartByOwnerID(userId, partName);

    console.log("partID is ", partID);

    const snapinInstalledPage = new SnapinInstalledPage(page);
    const notionCofig = new SnapInConfigPage(page);
    const notionNewConnection = new SnapInNewConnectionPage(page);

    await snapinInstalledPage.navigate();
    await snapinInstalledPage.clickAzureBoardSnapin();
    await notionCofig.startAirdrop();
    await notionCofig.notionSnapin();
    await notionCofig.createNotionConnection(notionConnectionname);
    await notionCofig.startAirdrop();
    await notionCofig.notionSnapin();
    await notionCofig.selectNotionConnection(
      notionConnectionname,
      workspace,
      partName
    );

    await waitForState(
      apiContext,
      workspace,
      process.env.MAPPING_STATE,
      delayInterval
    );
    await notionNewConnection.mapFields();
    await waitForState(
      apiContext,
      workspace,
      process.env.SYNCCOMPLETED_STATE,
      delayInterval
    );
  });

  test("Validate workspace sync data", async () => {
    const responseBody = await devrevAPI.airdropSyncHistory();

    const destinationItems =
      responseBody.sync_history[0].sync_run.report.destination_items;

    const typesToValidate = testData.types_to_validate;
    typesToValidate.forEach(({ type, expectedCount }) => {
      const item = destinationItems.find((item) => item.type === type);

      expect(item).toBeDefined();

      expect(item.count).toBe(expectedCount);

      console.log(`Validated ${type} count: ${item.count}`);
    });
  });

  /*test.afterAll(async () => {
    if (partID) await devrevAPI.deletePartbyID(partID);
    await apiContext.dispose();
  });*/
});
