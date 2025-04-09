import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity,Image, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode'; // Assure-toi d’avoir fait npm install jwt-decode
import * as Font from 'expo-font';
import { logoutUser } from '../services/Auth'; // Si tu as un fichier service pour le logout

const fetchFonts = async () => {
    await Font.loadAsync({
        'Orbitron-Regular': require('../assets/fonts/Orbitron-Regular.ttf'),
        'Orbitron-Medium': require('../assets/fonts/Orbitron-Medium.ttf'),
        'Orbitron-Bold': require('../assets/fonts/Orbitron-Bold.ttf'),
        'SixtyfourConvergence': require('../assets/fonts/SixtyfourConvergence.ttf'),
        'BrunoAce-Regular': require('../assets/fonts/BrunoAce-Regular.ttf'),
    });
};

const Accueil = ({ navigation }) => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkRole = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    const decoded = jwtDecode(token);
                    console.log(decoded);
                    if (decoded.role === 'admin') {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la vérification du rôle :', error);
            }
        };

        const loadFonts = async () => {
            await fetchFonts();
            setFontsLoaded(true);
        };

        loadFonts();
        checkRole();
    }, []);

    const handleLogout = async () => {
        await logoutUser(); // Déconnexion
        navigation.navigate('Connexion'); // Redirige vers la page de connexion après la déconnexion
    };

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <View
            style={styles.container}
            resizeMode="cover"
        >
            {/* Bouton Logout en haut à droite */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Image 
                source={require('../assets/logout.png')} // Assure-toi du chemin correct
                style={styles.logoutImage} // Style pour dimensionner l'image
            />
            </TouchableOpacity>

            <Text style={styles.title}>One Way Journey</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('characters')}>
                <Text style={styles.buttonText}>Jouer</Text>
            </TouchableOpacity>

            {isAdmin && (
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Admin')}>
                    <Text style={styles.buttonText}>Gérer les scénarios</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Accueil;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        color: 'rgb(183, 45, 230)',
        fontSize: 34,
        textAlign: 'center',
        marginBottom: 40,
        fontFamily: 'SixtyfourConvergence',
        textShadowColor: 'rgba(255, 147, 239, 0.65)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 17,
        paddingHorizontal: 20, // Ajoute de l'espace latéral
        flexWrap: 'wrap', // Permet au texte de passer à la ligne si nécessaire
    },
    button: {
        backgroundColor: 'rgba(169, 40, 216, 0.65)',
        padding: 15,
        borderRadius: 15,
        width: '80%',
        marginVertical: 10,
        shadowColor: 'rgba(194, 152, 187, 0.71)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    buttonText: {
        color: 'rgb(223, 182, 219)',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Orbitron-Bold',
    },
    // Style pour le bouton Logout en haut à droite
    logoutButton: {
        position: 'absolute',
        top: 20,
        left: 15,
        backgroundColor: 'rgba(151, 28, 172, 0)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        shadowColor: 'rgba(225, 9, 207, 0.46)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },

    logoutImage: {
        opacity : (0.8),
        width: 30, // Largeur de l'image
        height: 30, // Hauteur de l'image
        resizeMode: 'contain', // Garde les proportions
    },
});
