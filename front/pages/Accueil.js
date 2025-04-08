import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Accueil = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue dans l'Aventure Galactique</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Connexion')}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Inscription')}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Accueil;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0c1b2a',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    title: {
        color: '#fff',
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        marginVertical: 10
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    }
});
