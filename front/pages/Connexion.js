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
            navigation.reset({
                index: 0,
                routes: [{ name: 'Accueil' }],
            });

        } catch (error) {
            console.log("Erreur lors de la connexion :", error);

            if (error.code === 'ECONNABORTED') {
                Alert.alert("Erreur", "Le serveur a mis trop de temps à répondre. Veuillez réessayer.");
            } else if (error.response) {
                Alert.alert("Erreur", error.response.data.error || "Erreur serveur.");
            } else if (error.request) {
                Alert.alert("Erreur", "Problème de connexion au serveur.");
            } else {
                Alert.alert("Erreur", "Une erreur inattendue est survenue.");
            }
        }

    };

    return (
        // <ImageBackground source={require('../assets/space.jpg')} style={styles.container} resizeMode="cover">
        <View
            style={styles.container}
            resizeMode="cover"
        >
            <Text style={styles.title}>Connexion</Text>

            <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="rgba(255,255,255,0.6)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />


            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Inscription')}>
                <Text style={styles.link}>Pas encore de compte ? S'inscrire !</Text>
            </TouchableOpacity>
        {/*</ImageBackground>*/}
        </View>
    );
};

export default Connexion;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        color: '#fff',
        textAlign: "center",
        marginBottom: 40,
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
        borderColor: 'rgba(218, 9, 218, 0.65)',
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
        // borderColor: 'rgba(107, 31, 132, 0.32)',
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
