import { expect, test, request as playwrightRequest } from "@playwright/test";
import { SnapinInstalledPage } from "../../pages/devrev/snapin-installed-page";
import { AzureBoardConfigPage } from "../../pages/devrev/azure-board-config-page";
import { AzureBoardNewConnectionPage } from "../../pages/devrev/azure-board-new-connection-page";
import * as devrevApiUtils from "../../utils/devrev-api-utils";
import { faker } from "@faker-js/faker";
import { waitForState } from "../../utils/helper-utils";
import { DevrevAPI } from "../../utils/api-utils-new";

test.describe.serial("Azureboard Snapin Tests", () => {
  const connectionName = "small";
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
    test.slow();
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
    await azureBoardConfigPage.azureBoardSnapin();
    await azureBoardConfigPage.selectAzureBoardConnection(connectionName, partName);

    await waitForState(
      apiContext,
      connectionName,
      process.env.MAPPING_STATE,
      delayInterval
    );
    await azureBoardNewConnectionPage.mapFields();
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
    expect(worklistCount).toBe(expectedWorklistCount);
  });

  test("Validate the actual value of the ticket", async () => {
    const worklist = await devrevAPI.getWorkListByPartID(
      partID,
      testData.ticket_details.input.title
    );
    const workItem = worklist.works.find(
      (item) => item.title === testData.ticket_details.input.title
    );
    expect(workItem).toMatchObject({
      title: testData.ticket_details.output.title,
      priority: testData.ticket_details.output.priority,
      tags: expect.arrayContaining([
        expect.objectContaining({
          id: expect.objectContaining({
            name: testData.ticket_details.output.tag_name,
          }),
        }),
      ]),
      stage: expect.objectContaining({
        display_name: testData.ticket_details.output.stage_name,
      }),
    });
  });

  test.afterAll(async () => {
    if (partID) await devrevAPI.deletePartbyID(partID);
    await apiContext.dispose();
  });
});
