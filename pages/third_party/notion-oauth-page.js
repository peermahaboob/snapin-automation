class NotionOauthPage {
  constructor(page) {
    this.page = page;

    this.txtboxEmail = page.getByRole("textbox", {
      name: "Enter your email address...",
    });

    this.txtboxPassword = page.getByRole("textbox", {
      name: "Enter your password...",
    });

    this.btnContinue = page.getByRole("button", {
      name: "Continue with password",
    });

    this.btnSelectPages = page.getByRole("button", { name: "Select pages" });

    this.btnAllowAccess = page.getByRole("button", {
      name: "Allow access",
    });

    this.btnClickOwnerWorkspace = page
      .getByRole("button")
      .filter({ hasText: "Bhavani" });
  }

  async inputEmail(email) {
    await this.txtboxEmail.fill(email);
  }

  async inputPassword(password) {
    await this.txtboxPassword.fill(password);
  }

  async clickContinue() {
    await this.btnContinue.click();
  }

  async login(email, password) {
    await this.inputEmail(email);
    await this.txtboxEmail.press("Enter");
    await this.inputPassword(password);
    await this.clickContinue();
  }

  async selectWorkspace(workspaceName) {
    await this.btnClickOwnerWorkspace.click();
    await this.page
      .getByText(workspaceName, { exact: false })
      .filter({ hasText: workspaceName })
      .click();
    await this.btnSelectPages.click();
  }

  async allowAccess(workspaceName) {
    const checkbox = this.page
      .getByRole("menuitem")
      .filter({ hasText: workspaceName })
      .getByRole("checkbox");
    await checkbox.click();
    await this.page.getByRole("button", { name: "Allow access" }).click();
  }
}

module.exports = { NotionOauthPage };
