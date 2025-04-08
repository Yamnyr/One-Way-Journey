import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getUserCharacters = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/characters`, {
            headers: {
                Authorization: `Bearer ${token}`, // Envoi du token dans le header
            }
        });
        return response.data.characters; // Retourne la liste des personnages
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des personnages:', error);
        throw error;
    }
};
