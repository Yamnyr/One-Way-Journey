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

export const deleteScenario = async (token, scenarioId) => {
    const response = await axios.delete(`${API_URL}/scenarios/${scenarioId}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Envoi du token dans le header
        }
    });
    return response.data;
}
