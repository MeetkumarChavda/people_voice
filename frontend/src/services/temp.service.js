import apiClient from './api.config';

const TEMP_ENDPOINT = '/temp';

export const tempService = {
    // Get all temps
    getAll: async () => {
        try {
            const response = await apiClient.get(TEMP_ENDPOINT);
            return response;
        } catch (error) {
            console.error('Error fetching temps:', error);
            throw error;
        }
    },

    // Get single temp by ID
    getById: async (id) => {
        if (!id) throw new Error('ID is required');
        try {
            const response = await apiClient.get(`${TEMP_ENDPOINT}/${id}`);
            return response;
        } catch (error) {
            console.error(`Error fetching temp ${id}:`, error);
            throw error;
        }
    },

    // Create new temp
    create: async (data) => {
        if (!data?.title) throw new Error('Title is required');
        try {
            const response = await apiClient.post(TEMP_ENDPOINT, data);
            return response;
        } catch (error) {
            console.error('Error creating temp:', error);
            throw error;
        }
    },

    // Update temp
    update: async (id, data) => {
        if (!id) throw new Error('ID is required');
        if (!data || Object.keys(data).length === 0) {
            throw new Error('Update data is required');
        }
        try {
            const response = await apiClient.put(`${TEMP_ENDPOINT}/${id}`, data);
            return response;
        } catch (error) {
            console.error(`Error updating temp ${id}:`, error);
            throw error;
        }
    },

    // Delete temp
    delete: async (id) => {
        if (!id) throw new Error('ID is required');
        try {
            const response = await apiClient.delete(`${TEMP_ENDPOINT}/${id}`);
            return response;
        } catch (error) {
            console.error(`Error deleting temp ${id}:`, error);
            throw error;
        }
    }
}; 