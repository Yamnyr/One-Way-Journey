import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { loginUser } from '../services/Auth';

const Admin = ({ navigation }) => {


    return (
        <ImageBackground source={require('../assets/space.jpg')} style={styles.container} resizeMode="cover">
            <Text style={styles.title}>Admin</Text>
        </ImageBackground>
    );
};

export default Admin;

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
});
