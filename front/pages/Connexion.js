import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import axios from 'axios';  // Importer Axios

const Connexion = ({ navigation }) => {
    const [username, setUsername] = useState(''); // Utiliser username
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }

        try {
            // Remplace 'http://localhost:5000' par l'adresse IP de ton serveur si tu testes sur un appareil réel
            const response = await axios.post('http://localhost:3000/users/login', {
                username: username,  // Utilise le username
                password: password
            });

            // Si la connexion est réussie, tu reçois un token dans la réponse
            const { token, user } = response.data;

            // Sauvegarder le token dans le stockage local ou un contexte global
            // Par exemple : AsyncStorage.setItem('userToken', token);
            Alert.alert("Connexion réussie", `Bienvenue ${user.username} !`);

            // Naviguer vers l'écran Accueil
            navigation.navigate('Accueil');
        } catch (error) {
            // Gérer les erreurs (exemple : utilisateur non trouvé, mauvais mot de passe)
            if (error.response) {
                Alert.alert("Erreur", error.response.data.error);
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
            <Text style={styles.title}>Connexion</Text>

            <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"  // Utiliser 'Nom d'utilisateur' au lieu de 'Email'
                autoCapitalize="none"
                value={username}  // Utiliser username
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Inscription')}>
                <Text style={styles.link}>Pas encore de compte ? S'inscrire</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
};

export default Connexion;

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
