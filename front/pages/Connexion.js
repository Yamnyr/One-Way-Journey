import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { loginUser } from '../services/Auth';

const Connexion = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }

        try {
            const { user } = await loginUser(username, password);

            Alert.alert("Connexion réussie", `Bienvenue ${user.username} !`);

            // Rediriger vers Accueil après connexion
            navigation.reset({
                index: 0,
                routes: [{ name: 'Accueil' }],
            });

        } catch (error) {
            if (error.response) {
                Alert.alert("Erreur", error.response.data.error);
            } else {
                Alert.alert("Erreur", "Une erreur est survenue.");
            }
        }
    };

    return (
        <ImageBackground source={require('../assets/space.jpg')} style={styles.container} resizeMode="cover">
            <Text style={styles.title}>Connexion</Text>

            <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                autoCapitalize="none"
                value={username}
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
        backgroundColor: 'rgba(34, 186, 186, 0.6)',
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
        color: 'rgb(34, 186, 186)',
        textAlign: 'center',
        marginTop: 20,
    },
});
