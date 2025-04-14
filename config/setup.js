import { LoginOTPPage } from "../pages/devrev/login-otp-page.js";
import { UpdatesPage } from "../pages/devrev/updates-page.js";
import { chromium, expect } from "@playwright/test";
require('dotenv').config();
const fs = require("fs");
const path = require("path");

module.exports = async (config) => {
  const allureResultsPath = path.join(process.cwd(), "allure-results");
  if (fs.existsSync(allureResultsPath)) {
    fs.rmSync(allureResultsPath, { recursive: true, force: true });
    console.log("🧹 Allure results folder cleaned up.");
  }
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const loginPage = new LoginOTPPage(page);
  const updatesPage = new UpdatesPage(page);
  await loginPage.navigate();
  await loginPage.loginWithOtp(process.env.DEVREV_USERID);
  await updatesPage.updatesButtonIsVisible();
  await page.context().storageState({ path: process.env.BROWSER_SESSION_FILE });
  await browser.close();
};
