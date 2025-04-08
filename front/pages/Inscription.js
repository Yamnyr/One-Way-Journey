import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';

const Inscription = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        if (!username || !email || !password) {
            Alert.alert("Erreur", "Tous les champs sont obligatoires.");
            return;
        }

        // TODO : Intégrer avec la BDD ou Firebase
        Alert.alert("Inscription réussie", `Bienvenue ${username} !`);
        navigation.navigate('Connexion');
    };

    return (
        <View style={styles.container}>
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
        </View>
    );
};

export default Inscription;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0c1b2a',
        padding: 20,
        justifyContent: 'center'
    },
    title: {
        fontSize: 32,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: 'bold'
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    link: {
        color: '#1e90ff',
        textAlign: 'center',
        marginTop: 20
    }
});
