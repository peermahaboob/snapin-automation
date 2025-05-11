const fs = require('fs');
const path = require('path');


async function getIntegrationDetails(integration, domain) {
    const filePath = path.resolve(__dirname, '../config/3rd-party/connections.json'); 
    const config = JSON.parse(fs.readFileSync(filePath));
  
    const data = config[integration]?.[domain];
  
    if (!data) {
      throw new Error(`No config found for integration: ${integration}, domain: ${domain}`);
    }
  
    if (integration === 'azureboard') {
      return {
        subdomain: data.subdomain,
        username: data.username,
        token: data.token
      };
    } else if (integration === 'salesforce') {
      return {
        connectionString: data.connectionstring
      };
    } else {
      throw new Error(`Unsupported integration: ${integration}`);
    }
  }

  module.exports={getIntegrationDetails}