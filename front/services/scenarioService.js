import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getScenarioById = async (scenarioId, token) => {
    try {
        const response = await axios.get(`${API_URL}/scenarios/${scenarioId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.scenario; // Retourne le scénario
    } catch (error) {
        console.error('❌ Erreur lors de la récupération du scénario:', error);
        throw error;
    }
};

export const getAllScenarios = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/scenarios`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data.scenarios;
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des scénarios:', error);
        throw error;
    }
};