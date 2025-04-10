// services/statsService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getStatistics = async () => {
    try {
        // Récupérer le token depuis AsyncStorage
        const token = await AsyncStorage.getItem('userToken');

        if (!token) {
            throw new Error('Utilisateur non authentifié');
        }

        // Configurer les headers avec le token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        // Faire la requête à l'API
        const response = await axios.get(`${API_URL}/admin/statistics`, config);

        if (response.data && response.data.success) {
            return response.data.data;
        } else {
            throw new Error('Erreur lors de la récupération des statistiques');
        }
    } catch (error) {
        console.error('Erreur dans le service de statistiques:', error);
        throw error;
    }
};

export default {
    getStatistics,
};