const { BasePage } = require('./BasePage');
const { LoginOTPPage } = require('./devrev/login-otp-page');
const { AzureBoardConfigPage } = require('./devrev/azure-board-config-page');
const { AzureBoardNewConnectionPage } = require('./devrev/azure-board-new-connection-page');
const {SnapinInstalledPage}= require('./devrev/snapin-installed-page');
const { UpdatesPage } = require('./devrev/updates-page');
const { NotionOauthPage } = require('./third_party/notion-oauth-page');

module.exports = {
  BasePage,
  LoginOTPPage,
  AzureBoardConfigPage,
  AzureBoardNewConnectionPage,
  SnapinInstalledPage,
  UpdatesPage,
  NotionOauthPage,
};