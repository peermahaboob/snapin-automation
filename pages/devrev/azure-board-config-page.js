import {AzureBoardNewConnectionPage} from './azure-board-new-connection-page';
import { faker } from '@faker-js/faker';

class AzureBoardConfigPage {
    constructor(page) {
        this.page = page;
        this.buttonStartAirdrop= page.locator('//button[normalize-space()="Start Airdrop"]');
        this.buttonAzureBoardSnapin=page.locator('//button[@data-drid="connections--service-card-snap_ins"]');
        this.dropdownSelectConnection=page.locator('//span[@class="input-base_select-value__JmDg9"]');
        this.selectNewConnection=page.locator('//div[contains(text(),"Add connection")]');
        this.AddNewConnection=page.locator('//button[normalize-space()="Add connection"]');
        this.selectAzureboardConnection=page.locator('//div[@class="flex items-center gap-2"]');
        

    }

    async startAirdrop() {
        
        await this.buttonStartAirdrop.click();
    }

    async azureBoardSnapin() {
        await this.buttonAzureBoardSnapin.click();
    }

    async selectConnection(datasource,partName) {
        await this.dropdownSelectConnection.click();
        if (await this.selectNewConnection.isVisible()) {
            await this.selectNewConnection.click();
          }
          else if (await this.AddNewConnection.isVisible()) {
            
            await this.AddNewConnection.click();
          }
        await this.dropdownSelectConnection.click();
        await this.selectAzureboardConnection.click();
        const azureBoardNewConnection= new AzureBoardNewConnectionPage(this.page);
        await azureBoardNewConnection.fillConnectionDetails(faker.lorem.words(2),datasource,partName);

        

    }
    

}

module.exports = { AzureBoardConfigPage };