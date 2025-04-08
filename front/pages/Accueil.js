import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const Accueil = ({ navigation }) => {
    return (
        <ImageBackground
            source={require('../assets/space.jpg')} // Remplace avec le chemin de ton image
            style={styles.container}
            resizeMode="cover"
        >
            <Text style={styles.title}>Bienvenue dans l'Aventure Galactique</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Connexion')}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Inscription')}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
};

export default Accueil;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: 'bold',
        fontFamily: 'Orbitron', // Si tu utilises une police futuriste
        textShadowColor: 'rgba(0, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 15,
        width: '80%',
        marginVertical: 10,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Orbitron',
    },
});
