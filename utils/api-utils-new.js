import { expect } from '@playwright/test';
import { API_ENDPOINTS } from '../config/env/api-constants'

class DevrevAPI {
  constructor(request) {
    this.request = request;
    this.authorizationToken = process.env.AUTH_TOKEN;
    this.apiBaseUrl = process.env.BASE_URL;
    this.contentType = 'application/json';
  }

  get headers() {
    return {
    authorization:"Bearer " +this.authorizationToken,
      'Content-Type': this.contentType,
    };
  }

  async getUserIdByEmail(email) {
    try {
      const response = await this.request.get(`https://api.devrev.ai/${API_ENDPOINTS.USERS_LIST}`, {
        headers: this.headers,
      });
  
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
  
      const user = responseBody.dev_users.find(user => user.created_by?.email === email);
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
  
      const userId = user.created_by.id;
      console.log(userId);
      return userId;
    } catch (error) {
      console.error('Error fetching user ID:', error);
      throw error; 
    }
  }

  async createPartByOwnerID(ownerId, partName, partType = 'product') {
    const data = {
      name: partName,
      owned_by: [ownerId],
      type: partType,
    };

    const response = await this.request.post(`https://api.devrev.ai/${API_ENDPOINTS.PART_CREATE}`, {
      headers: this.headers,
      data,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    return responseBody.part.id;
  }

  async getKeyrings() {
    const response = await this.request.get(`${this.apiBaseUrl}${API_ENDPOINTS.KEYRINGS_LIST}`, {
      headers: this.headers,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const keyringIds = responseBody.keyrings.map(keyring => keyring.id);
    keyringIds.forEach(id => console.log(id));
    return keyringIds;
    
  }

  async deleteKeyrings() {
    const keyringIds = await this.getKeyrings();

    if (keyringIds.length === 0) {
      console.log('No keyrings to delete.');
      return;
    }

    for (const id of keyringIds) {
      const data = { id };

      const response = await this.request.post(`${this.apiBaseUrl}${API_ENDPOINTS.KEYRINGS_DELETE}`, {
        headers: this.headers,
        data,
      });

      expect(response.status() === 200 || response.status() === 204).toBe(true);
    }
  }

  async getAirdropList(syncUnitName = null) {
    const data = syncUnitName ? { filter: { name: syncUnitName } } : {};

    const response = await this.request.post(`${this.apiBaseUrl}${API_ENDPOINTS.AIRDROP_LIST}`, {
      headers: this.headers,
      data,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const airdropList = responseBody.sync_units.map(unit => unit.id);
    airdropList.forEach(id => console.log(id));
    return airdropList;
  }

  async deleteAirdrop() {
    const airdropList = await this.getAirdropList();

    if (airdropList.length === 0) {
      console.log('No airdrops to delete.');
      return;
    }

    for (const id of airdropList) {
      const data = { id, action: 'delete' };

      const response = await this.request.post(`${this.apiBaseUrl}${API_ENDPOINTS.AIRDROP_ACTION}`, {
        headers:this.headers,
        data,
      });

      expect(response.status()).toBe(200);
    }
  }

  async getAirdropState(syncUnitName) {
    const data = {
      filter: {
        sync_unit_name: syncUnitName,
      },
    };

    const response = await this.request.post(`${this.apiBaseUrl}${API_ENDPOINTS.AIRDROP_LIST}`, {
      headers: this.headers,
      data,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    for (const unit of responseBody.sync_units) {
      if (unit.name === syncUnitName) {
        const state = unit.sync_run.progress.state;
        console.log('State:', state);
        return state;
      }
    }
  }

  async getWorkListByPartID(partid) {
    const data = {
      type: ["issue"],
      issue: {
        applies_to_part: {
          include_child_parts: true,
          parts: [partid],
        },
      },
      exclude_child_items: true,
    };

    const response = await this.request.post(`${this.apiBaseUrl}${API_ENDPOINTS.WORKS_LIST}`, {
      headers: this.headers,
      data,
    });

    return await response.json();
  }

  async deletePartbyID(partid) {
    const data = { id: partid };

    try {
      const response = await this.request.post(`${this.apiBaseUrl}${API_ENDPOINTS.PART_DELETE}`, {
        headers: this.headers,
        data,
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
}

module.exports = {DevrevAPI};
