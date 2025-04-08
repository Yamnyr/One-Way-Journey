import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import { getAllScenarios } from '../services/adminService';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Admin = () => {
    const navigation = useNavigation();
    const [scenarios, setScenarios] = useState([]);

    const handleBack = () => {
        navigation.goBack(); // ⬅️ Retour à l'écran précédent
    };

    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                if (!token) return;

                const data = await getAllScenarios(token);
                setScenarios(data.scenarios);
            } catch (error) {
                console.error("Erreur lors du chargement des scénarios :", error);
            }
        };

        fetchScenarios();
    }, []);

    const renderItem = ({ item }) => {
        const title = item.title || "Titre non disponible";
        const choices = item.choices ? item.choices.join(", ") : "Aucun choix disponible";

        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <Text style={styles.cardChoices}>Choix: {choices}</Text>
            </View>
        );
    };

    return (
        <ImageBackground source={require('../assets/space.jpg')} style={styles.container} resizeMode="cover">
            <TouchableOpacity onPress={handleBack} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Retour</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Scénarios</Text>

            <FlatList
                data={scenarios}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.scrollContent}
                ListEmptyComponent={<Text style={styles.noDataText}>Aucun scénario trouvé.</Text>}
            />
        </ImageBackground>
    );
};

export default Admin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    logoutButton: {
        alignSelf: 'flex-end',
        marginTop: 40,
        marginRight: 10,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
    },
    logoutText: {
        color: '#fff',
        fontFamily: 'Orbitron',
        fontSize: 12,
    },
    scrollContent: {
        paddingBottom: 40,
        paddingTop: 20,
    },
    title: {
        fontSize: 32,
        color: 'rgb(183, 45, 230)',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
        fontFamily: 'Orbitron',
        textShadowColor: 'rgba(0, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    noDataText: {
        color: '#ccc',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Orbitron',
    },
    card: {
        backgroundColor: 'rgba(30, 15, 40, 0.85)',
        padding: 18,
        borderRadius: 15,
        marginBottom: 15,
        borderColor: 'rgba(183, 45, 230, 0.4)',
        borderWidth: 1,
        shadowColor: 'rgba(194, 152, 187, 0.71)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },
    cardTitle: {
        color: 'rgb(223, 182, 219)',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Orbitron',
        marginBottom: 8,
    },
    cardDescription: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 5,
        fontFamily: 'Orbitron',
    },
    cardChoices: {
        color: 'rgb(183, 45, 230)',
        fontSize: 14,
        marginTop: 5,
        fontFamily: 'Orbitron',
    },
});
