import {expect} from '@playwright/test'
class UpdatesPage{

    constructor(page) {
        this.page=page;
        this.updatesButton=page.locator('//span[@data-drid="updates--page--slot-label"]');

    }

    async updatesButtonIsVisible(){
        await this.updatesButton.waitFor({ state: 'visible', timeout: 60000 });
        await expect(this.updatesButton).toBeVisible();
    }

}

module.exports = {UpdatesPage};
//export { UpdatesPage };
