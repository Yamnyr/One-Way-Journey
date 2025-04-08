import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Récupérer les personnages de l'utilisateur connecté
export const getUserCharacters = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/characters`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data.characters;
    } catch (error) {
        // console.error('❌ Erreur lors de la récupération des personnages:', error);
        throw error;
    }
};

// Supprimer un personnage par ID
export const deleteCharacter = async (characterId, token) => {
    try {
        await axios.delete(`${API_URL}/characters/${characterId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true };
    } catch (error) {
        // console.error('❌ Erreur lors de la suppression du personnage:', error);
        throw error;
    }
};

// Créer un nouveau personnage
export const createCharacter = async (characterData, token) => {
    try {
        const response = await axios.post(`${API_URL}/characters/create`, characterData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.character; // Retourne le personnage créé
    } catch (error) {
        console.error('❌ Erreur lors de la création du personnage:', error);
        throw error;
    }
};
