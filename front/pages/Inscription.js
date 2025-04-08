import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { registerUser } from '../services/Auth';  // Importer la fonction d'inscription

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
            await registerUser(username, email, password);  // Utiliser la fonction registerUser
            Alert.alert("Inscription réussie", `Bienvenue ${username} !`);
            navigation.navigate('Connexion');
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
                <Text style={styles.link}>Déjà un compte ? Se connecter !</Text>
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
        fontFamily: 'Orbitron',
    },
});
