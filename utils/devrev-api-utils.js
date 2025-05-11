const { expect} = require('@playwright/test');

const authorizationToken='Bearer eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHBzOi8vYXV0aC10b2tlbi5kZXZyZXYuYWkvIiwia2lkIjoic3RzX2tpZF9yc2EiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsiamFudXMiXSwiYXpwIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvLzExOHl4ZmpmM3U6ZGV2dS84IiwiZXhwIjoxNzc0MDI2OTI2LCJodHRwOi8vZGV2cmV2LmFpL2F1dGgwX3VpZCI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by9zdXBlcjphdXRoMF91c2VyL29pZGN8cGFzc3dvcmRsZXNzfGVtYWlsfDY3YjQ4NDU1MjdmNTBhOTU4MzA3MzM2NSIsImh0dHA6Ly9kZXZyZXYuYWkvYXV0aDBfdXNlcl9pZCI6Im9pZGN8cGFzc3dvcmRsZXNzfGVtYWlsfDY3YjQ4NDU1MjdmNTBhOTU4MzA3MzM2NSIsImh0dHA6Ly9kZXZyZXYuYWkvZGV2b19kb24iOiJkb246aWRlbnRpdHk6ZHZydi11cy0xOmRldm8vMTE4eXhmamYzdSIsImh0dHA6Ly9kZXZyZXYuYWkvZGV2b2lkIjoiREVWLTExOHl4ZmpmM3UiLCJodHRwOi8vZGV2cmV2LmFpL2RldnVpZCI6IkRFVlUtOCIsImh0dHA6Ly9kZXZyZXYuYWkvZGlzcGxheW5hbWUiOiJtYWhhYm9vYnBlZXIiLCJodHRwOi8vZGV2cmV2LmFpL2VtYWlsIjoibWFoYWJvb2JwZWVyQGdtYWlsLmNvbSIsImh0dHA6Ly9kZXZyZXYuYWkvZnVsbG5hbWUiOiJNYWhhYm9vYnBlZXIiLCJodHRwOi8vZGV2cmV2LmFpL2lzX3ZlcmlmaWVkIjp0cnVlLCJodHRwOi8vZGV2cmV2LmFpL3Rva2VudHlwZSI6InVybjpkZXZyZXY6cGFyYW1zOm9hdXRoOnRva2VuLXR5cGU6cGF0IiwiaWF0IjoxNzQyNDkwOTI2LCJpc3MiOiJodHRwczovL2F1dGgtdG9rZW4uZGV2cmV2LmFpLyIsImp0aSI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by8xMTh5eGZqZjN1OnRva2VuLzJ5OGlRSDF3Iiwib3JnX2lkIjoib3JnX1BWYVR1QWtMZ3FXMGRYQlQiLCJzdWIiOiJkb246aWRlbnRpdHk6ZHZydi11cy0xOmRldm8vMTE4eXhmamYzdTpkZXZ1LzgifQ.ZXbPJ2EV_fisXn41f1S2b-gcNdThg4X1xJKULXNW2ppkdwWBvQrDsIDEvwzH-phqF6bz5s7RI6347I1K5UBkSrtL_oxhT9e-DdjaALoeDhubpR9h780wsys3KzQ0mhYfZ-tMLFOdX9K1NjW63T4nxEF3uXbSoTVxbJLNJoPSl7YvIC_c3CEzWim54fSUjleUBfRuhfDdJxScmYuKBNV-OCCQn1aVXROOD-DBRGoiZm5-BNIv4tYy0OVwgMxbeCL93soqQqb3tgmtzMHB7Jp6sfirVHMhLUYtUtXktb9pJYTT2BgDJXWO-6Y2KLcxVshmHGfglSuMVcyHbI3CT1wt7g';
const contentType='application/json'

async function getUserIdByEmail(request, email) {
  const url = 'https://api.devrev.ai/dev-users.list';
  const headers = {
    Authorization: authorizationToken,
    'Content-Type': contentType,
  };

  try {
    const response = await request.get(url, {
      headers: headers,
    });

  
    expect(response.status()).toBe(200);

    
    const responseBody = await response.json();

    
    const userId = responseBody.dev_users.find(user => user.created_by.email === email)?.created_by.id;

    
    console.log(userId);

    return userId;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    throw error;
  }
}

async function createPartByOwnerID(request, ownerId, partName, partType = 'product') {
  const url = 'https://api.devrev.ai/parts.create';
  const headers = {
    Authorization: authorizationToken,
    'Content-Type': contentType,
  };

  const data = {
    name: partName,
    owned_by: [ownerId],
    type: partType,
  };

  try {
    const response = await request.post(url, {
      headers: headers,
      data: data,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    return responseBody.part.id;
  } catch (error) {
    console.error('Error creating part:', error);
    throw error;
  }
}

  async function getKeyrings(request) {
    const url = 'https://app.devrev.ai/api/gateway/internal/keyrings.list';
    const headers = {
      Authorization: authorizationToken,
    };
  
    try {
      
      const response = await request.get(url, {
        headers: headers,
      });
  
      
      expect(response.status()).toBe(200);
  
      
      const responseBody = await response.json();
  
      
      const keyringIds = responseBody.keyrings.map(keyring => keyring.id);
  
      
      keyringIds.forEach(id => console.log(id));
  
      return keyringIds;
    } catch (error) {
      console.error('Error fetching keyrings:', error);
      throw error;
    }
  }
  

  async function getAirdropList(request, syncUnitName = null) {
    const url = 'https://app.devrev.ai/api/gateway/internal/airdrop.sync-units.list';
    const headers = {
      Authorization: authorizationToken,
    };
  
    const data = syncUnitName === null ? {} : { filter: { name: syncUnitName } };
  
    try {
      
      const response = await request.post(url, {
        headers: headers,
        data: data,
      });
  
      expect(response.status()).toBe(200);
  
      const responseBody = await response.json();
  
      
      const airdropList = responseBody.sync_units.map(sync_unit => sync_unit.id);
  
      
      airdropList.forEach(airdrop => console.log(airdrop));
  
      return airdropList;
    } catch (error) {
      console.error('Error fetching airdrop list:', error);
      throw error;
    }
  }

  async function deleteKeyrings(request) {
    const url = 'https://app.devrev.ai/api/gateway/internal/keyrings.delete';
    const keyringIds = await getKeyrings(request);
    const headers = {
      Authorization: authorizationToken,
    };
  
    try {
      if (keyringIds.length === 0) {
        console.log('No keyrings to delete.');
        return; // Exit the function if there are no keyrings to delete
      }
  
      for (const keyringId of keyringIds) {
        const data = {
          id: keyringId,
        };
  
        const response = await request.post(url, {
          headers: headers,
          data: data,
        });
        expect(response.status() === 200 || response.status() === 204).toBe(true);
      }
    } catch (error) {
      console.error('Error deleting keyrings:', error);
      throw error;
    }
  }

  async function getAirdropState(request, syncUnitName) {
    const url = 'https://app.devrev.ai/api/gateway/internal/airdrop.sync-units.list';
    const headers = {
      Authorization: authorizationToken,
      'Content-Type': contentType,
    };
    const data = {
      filter: {
        sync_unit_name: syncUnitName,
      },
    };
    
    const response = await request.post(url, {
      headers: headers,
      data: data,
    });
    console.log(response.data);
    expect(response.status()).toBe(200);
  
    // Parse the response body
    const responseBody = await response.json();
  
    // Iterate through the sync_units array
    for (const syncUnit of responseBody.sync_units) {
      // Check if the name matches the provided syncUnitName
      if (syncUnit.name === syncUnitName) {
        // Get the state under progress
        const state = syncUnit.sync_run.progress.state;
        console.log('State:', state); // Output: "recipe_discovery_waiting_for_user_input"
        return state; // Return the state and exit the function
      }
    }
  
    // If no sync unit matches the name, return null or throw an error
    //console.log(`No sync unit found with name: ${syncUnitName}`);
    //return null; // Or throw new Error(`No sync unit found with name: ${syncUnitName}`);
  }

  

  async function deleteAirdrop(request) {
    const airdropList = await getAirdropList(request);
    const url = 'https://app.devrev.ai/api/gateway/internal/airdrop.sync-units.action';
    const headers = {
      Authorization: authorizationToken,
      
    };
  
    try {
      if (airdropList.length === 0) {
        console.log('No airdrops to delete.');
        return; // Exit the function if there are no keyrings to delete
      }
      for (const airdropId of airdropList) {
        const data = {
          action: 'delete',
          id: airdropId,
        };
  
        const response = await request.post(url, {
          headers: headers,
          data: data,
        });
  
        expect(response.status()).toBe(200);
      }
    } catch (error) {
      console.error('Error deleting airdrop:', error);
      throw error;
    }
  }

  async function getWorkListByPartID(request, partId,searchQuery="") {
    const url = 'https://app.devrev.ai/api/gateway/internal/works.list';
    const headers = {
      Authorization: authorizationToken,
      contentType: contentType,
    };

    const data = {
      type: [
          "issue"
      ],
      issue: {
          applies_to_part: {
              include_child_parts: true,
              parts: [
                partId
              ]
          }
      },
      search_query:searchQuery,
      exclude_child_items: true
  }

   
      const response = await request.post(url, {
        headers: headers,
        data: data,
      });
      const responseBody = await response.json();
      return responseBody;
    } 

    async function deletePartbyID(request, partid) {
    const url = 'https://api.devrev.ai/parts.delete';
    const headers = {
      Authorization: authorizationToken,
      'Content-Type': contentType,
    };
    const data = {
          id: partid,
        };
  
        try {
          const response = await request.post(url, {
            headers: headers,
            data: data,
          });
  
          expect(response.status()).toBe(200);
        } catch (error) {
          if (error.response) {
            console.error(`Error: ${error.response.data.message}`);
          } else if (error.request) {
            console.error('Error: No response received from the server');
          } else {
            console.error('Error: Request setup failed', error.message);
          }
          throw new Error('Failed to delete part by ID');
        }
    }

  
module.exports = { getUserIdByEmail,createPartByOwnerID,getKeyrings,deleteKeyrings,getAirdropList,deleteAirdrop,getAirdropState,getWorkListByPartID,deletePartbyID};