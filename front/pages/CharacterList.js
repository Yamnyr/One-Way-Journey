import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { getUserCharacters } from '../services/characterService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserCharactersScreen = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken'); // Récupère le token stocké
                if (!token) {
                    setError("Token non trouvé. Veuillez vous reconnecter.");
                    setLoading(false);
                    return;
                }
                const data = await getUserCharacters(token);
                setCharacters(data);
            } catch (err) {
                setError("Erreur lors du chargement des personnages.");
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    if (error) {
        return <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes Personnages</Text>
            <FlatList
                data={characters}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.characterCard}>
                        <Text style={styles.characterName}>{item.name}</Text>
                        <Text>Espèce: {item.species}</Text>
                        <Text>Vie: {item.life}</Text>
                        <Text>Charisme: {item.charisma}</Text>
                        <Text>Dextérité: {item.dexterity}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red', fontSize: 16 },
    characterCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
    },
    characterName: { fontSize: 18, fontWeight: 'bold' },
});

export default UserCharactersScreen;
