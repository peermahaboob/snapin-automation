const { BasePage } = require('./devrev/base-page');
const { LoginOTPPage } = require('./devrev/login-otp-page');
const { AzureBoardConfigPage } = require('./devrev/snap-in-config-page');
const { AzureBoardNewConnectionPage } = require('./devrev/snap-in-new-connection-page');
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