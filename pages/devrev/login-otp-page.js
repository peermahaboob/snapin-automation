import { readOtpFromGmail } from "../../utils/helper-utils";
const{BasePage} = require('./base-page');

const gmailAuthocode=process.env.GMAIL_AUTHCODE;
class LoginOTPPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailField = page.locator('input[id="1-email"]');
    this.submitLoginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator(".auth0-lock-error-msg");
    this.otpField = page.locator('input[id="1-vcode"]');
    this.submitOtpButton = page.locator('button[id="1-submit"]');
  }

  async navigate() {
    await this.page.goto(process.env.URL);
  }

  async loginWithOtp(email) {
    await this.emailField.fill(email);
    await this.submitLoginButton.click();
    await this.page.waitForTimeout(10000);

    // Get the OTP as a string
    const otp = await readOtpFromGmail(
      email,
      gmailAuthocode
    );

    // Make sure otp is a string before filling
    if (typeof otp === "string") {
      await this.otpField.fill(otp);
      await this.submitOtpButton.click();
    } else {
      throw new Error("OTP not found or invalid");
    }
  }
}

module.exports = { LoginOTPPage };
