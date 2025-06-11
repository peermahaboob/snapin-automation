import {expect} from '@playwright/test';
const{BasePage} = require('./base-page');
class UpdatesPage extends BasePage{

    constructor(page) {
        super(page);
        this.updatesButton=page.locator('//span[@data-drid="updates--page--slot-label"]');

    }

    async updatesButtonIsVisible(){
        await this.updatesButton.waitFor({ state: 'visible', timeout: 60000 });
        await expect(this.updatesButton).toBeVisible();
    }

}

module.exports = {UpdatesPage};
