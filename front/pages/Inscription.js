import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { registerUser } from '../services/Auth';

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
            await registerUser(username, email, password);
            // Alert.alert("Inscription réussie", `Bienvenue ${username} !`);
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
        <View style={styles.container}>
            <Text style={styles.title}>Inscription</Text>

            <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Adresse email"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="rgba(255,255,255,0.6)"
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
        </View>
    );
};

export default Inscription;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        color: 'rgb(219, 4, 198)',
        fontSize: 27,
        textAlign: "center",
        marginBottom: 30,
        fontWeight: "bold",
        textShadowColor: "rgba(255, 147, 239, 0)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 17,
        fontFamily: "Orbitron-Bold",
    },
    input: {
        backgroundColor: 'rgba(60, 20, 80, 0.3)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(183, 45, 230, 0.4)',
        color: 'white',
        padding: 15,
        marginBottom: 20,
        fontFamily: 'Orbitron-Regular',
        fontSize: 16,
    },
    button: {
        backgroundColor: 'rgba(218, 9, 218, 0.65)',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Orbitron-Regular',
    },
    link: {
        color: 'rgb(223, 182, 219)',
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'Orbitron-Regular',
        fontStyle: 'italic',
    },
});
