import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Vérifier si un token existe dans AsyncStorage
export const checkUserToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        return token ? true : false;
    } catch (error) {
        console.error("Erreur lors de la récupération du token :", error);
        return false;
    }
};

// Connexion utilisateur
export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, { username, password });
        const { token, user } = response.data;

        // Stocker le token
        await AsyncStorage.setItem('userToken', token);

        return { token, user };
    } catch (error) {
        throw error;
    }
};

// Inscription utilisateur
export const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, { username, email, password });
        const { token, user } = response.data;

        // Stocker le token
        await AsyncStorage.setItem('userToken', token);

        return { token, user };
    } catch (error) {
        throw error;
    }
};

// Déconnexion utilisateur
export const logoutUser = async () => {
    try {
        await AsyncStorage.removeItem('userToken');
    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
    }
};
