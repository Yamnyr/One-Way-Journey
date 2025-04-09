import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getAllScenarios = async (token) => {
    const response = await axios.get(`${API_URL}/scenarios`, {
        headers: {
            Authorization: `Bearer ${token}`, // Envoi du token dans le header
        }
    });
    return response.data;
};

export const createScenario = async (token, scenarioData) => {
    const response = await axios.post(`${API_URL}/scenarios/create`, scenarioData, {
        headers: {
            Authorization: `Bearer ${token}`, // Envoi du token dans le header
        }
    });
    return response.data;
};

export const deleteScenario = async (token, scenarioId) => {
    const response = await axios.delete(`${API_URL}/scenarios/${scenarioId}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Envoi du token dans le header
        }
    });
    return response.data;
}

export const updateScenario = async (token, scenarioId, scenarioData) => {
    const response = await axios.put(`${API_URL}/scenarios/${scenarioId}`, scenarioData, {
        headers: {
            Authorization: `Bearer ${token}`, // Envoi du token dans le header
        }
    });
    return response.data;
};