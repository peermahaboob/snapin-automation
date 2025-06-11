import { expect, test, request as playwrightRequest } from "@playwright/test";
import { SnapinInstalledPage } from "../../pages/devrev/snapin-installed-page";
import { SnapInConfigPage } from "../../pages/devrev/snap-in-config-page";
import { SnapInNewConnectionPage } from "../../pages/devrev/snap-in-new-connection-page";
import { faker } from "@faker-js/faker";
import { waitForState } from "../../utils/helper-utils";
import { DevrevAPI } from "../../utils/api-utils-new";

test.describe.serial("Azureboard Snapin Tests", () => {
  const connectionName = "small";
  const delayInterval = 5000;
  const testData = require("../../test_data/azure_board/validation_testdata.json");
  let partID = 'don:core:dvrv-us-1:devo/118yxfjf3u:product/376';
  let devrevAPI;
  let apiContext;

  test.beforeAll(async () => {
    apiContext = await playwrightRequest.newContext();
    devrevAPI = new DevrevAPI(apiContext);
    await devrevAPI.deleteKeyrings();
    await devrevAPI.deleteAirdrop();
  });

  test("Configure azureboard snapin", async ({ page }) => {
    test.slow();
    const partName = faker.lorem.word();
    const userId = await devrevAPI.getUserIdByEmail(process.env.DEVREV_USERID);
    partID = await devrevAPI.createPartByOwnerID(userId, partName);

    console.log("partID is ", partID);

    const snapinInstalledPage = new SnapinInstalledPage(page);
    const azureboardCofiguration = new SnapInConfigPage(page);
    const azureboardNewConnection = new SnapInNewConnectionPage(page);

    await snapinInstalledPage.navigate();
    await snapinInstalledPage.clickAzureBoardSnapin();
    await azureboardCofiguration.startAirdrop();
    await azureboardCofiguration.azureBoardSnapin();
    await azureboardCofiguration.selectAzureBoardConnection(
      connectionName,
      partName
    );

    await waitForState(
      apiContext,
      connectionName,
      process.env.MAPPING_STATE,
      delayInterval
    );
    await azureboardNewConnection.mapFields();
    await waitForState(
      apiContext,
      connectionName,
      process.env.SYNCCOMPLETED_STATE,
      delayInterval
    );
  });

  test("Check worklist number matches expected AzureBoard data", async () => {
    const worklist = await devrevAPI.getWorkListByPartID(partID);
    const worklistCount = worklist.works?.length || 0;
    expect(worklistCount).toBe(testData.ticket_count.output);
  });

  test("Validate the actual value of the ticket", async () => {
    const worklist = await devrevAPI.getWorkListByPartID(
      partID,
      testData.ticket_details.input.title
    );
    const workItem = worklist.works.find(
      (item) => item.title === testData.ticket_details.input.title
    );

    //console.log("workItem is ", workItem);

    expect(workItem).toMatchObject({
      title: testData.ticket_details.output.title,
      priority: testData.ticket_details.output.priority,
      /*tags: expect.arrayContaining([
        expect.objectContaining({
          id: expect.objectContaining({
            name: testData.ticket_details.output.tag_name,
          }),
        }),
      ]),
      stage: expect.objectContaining({
        display_name: testData.ticket_details.output.stage_name,
      }),*/
    });
  });

  test.afterAll(async () => {
    //console.log("Deleting partID ", partID);
    //if (partID) await devrevAPI.deletePartbyID(partID);
    await apiContext.dispose();
  });
});
