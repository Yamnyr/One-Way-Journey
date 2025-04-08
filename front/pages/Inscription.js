import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import axios from 'axios'; // Importer axios

const Inscription = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert("Erreur", "Tous les champs sont obligatoires.");
            return;
        }

        try {
            // Remplace 'http://localhost:3333' par l'adresse IP de ton serveur si tu testes sur un appareil réel
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users/register`, {
                username,
                email,
                password,
                role: 'player', // Si tu as un rôle par défaut
            });

            // Si l'inscription réussit, tu reçois un token et un utilisateur
            const { token, user } = response.data;

            // Sauvegarder le token dans un stockage local ou un contexte global
            // Exemple : AsyncStorage.setItem('userToken', token);

            Alert.alert("Inscription réussie", `Bienvenue ${user.username} !`);
            navigation.navigate('Connexion');
        } catch (error) {
            // Gérer les erreurs
            if (error.response) {
                Alert.alert("Erreur", error.response.data.error); // Afficher l'erreur venant de l'API
            } else {
                Alert.alert("Erreur", "Une erreur est survenue.");
            }
        }
    };

    return (
        <ImageBackground
            source={require('../assets/space.jpg')} // Remplace avec le chemin de ton image
            style={styles.container}
            resizeMode="cover"
        >
            <Text style={styles.title}>Inscription</Text>

            <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Adresse email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Connexion')}>
                <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
};

export default Inscription;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: 'bold',
        fontFamily: 'Orbitron',
        textShadowColor: 'rgba(0, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        fontFamily: 'Orbitron',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Orbitron',
    },
    link: {
        color: '#1e90ff',
        textAlign: 'center',
        marginTop: 20,
    },
});
