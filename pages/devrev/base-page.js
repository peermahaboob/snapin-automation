class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(url) {
    await this.page.goto(process.env.URL);
  }
}

module.exports = { BasePage };
