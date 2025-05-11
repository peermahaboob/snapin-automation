import { LoginOTPPage } from "../pages/devrev/login-otp-page.js";
import { UpdatesPage } from "../pages/devrev/updates-page.js";
import { chromium, expect } from "@playwright/test";
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const cleanUpAllureFolders = async () => {
  const allureResultsPath = path.join(process.cwd(), "allure-results");
  const allureReportPath = path.join(process.cwd(), "allure-report");

  const folders = [allureResultsPath, allureReportPath];

  for (const folder of folders) {
    if (fs.existsSync(folder)) {
      try {
        await fs.promises.rm(folder, { recursive: true, force: true });
        console.log(
          `Allure ${
            folder.includes("results") ? "results" : "report"
          } folder cleaned up.`
        );
      } catch (error) {
        console.error(`Error cleaning up ${folder}:`, error);
      }
    }
  }
};

const loginSession = async () => {
  /*const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const loginPage = new LoginOTPPage(page);
  const updatesPage = new UpdatesPage(page);

  await loginPage.navigate();
  await loginPage.loginWithOtp(process.env.DEVREV_USERID);
  await updatesPage.updatesButtonIsVisible();
  await page.context().storageState({ path: process.env.BROWSER_SESSION_FILE });

  await browser.close();*/
};

module.exports = async (config) => {
  await cleanUpAllureFolders();
  await loginSession();
};
