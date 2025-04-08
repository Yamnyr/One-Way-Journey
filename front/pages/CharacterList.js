import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ImageBackground
} from 'react-native';
import { getUserCharacters, deleteCharacter } from '../services/characterService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserCharactersScreen = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
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

    const handleDelete = async (characterId) => {
        Alert.alert(
            "Confirmation",
            "Êtes-vous sûr de vouloir supprimer ce personnage ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('userToken');
                            await deleteCharacter(characterId, token);
                            setCharacters(characters.filter(c => c.id !== characterId)); // Met à jour la liste
                        } catch (err) {
                            Alert.alert("Erreur", "Impossible de supprimer ce personnage.");
                        }
                    },
                },
            ]
        );
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    if (error) return <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>;

    return (
        <ImageBackground
            source={require('../assets/space.jpg')}
            style={styles.container}
            resizeMode="cover"
        >
            <Text style={styles.title}>Mes Personnages</Text>
            {characters.length === 0 ? (
                <Text style={styles.emptyText}>Vous n'avez aucun personnage pour le moment.</Text>
            ) : (
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
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(item.id)}
                            >
                                <Text style={styles.deleteButtonText}>❌ Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: 'white' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red', fontSize: 16 },
    emptyText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'white',
        marginTop: 20,
        fontStyle: 'italic'
    },
    characterCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
    },
    characterName: { fontSize: 18, fontWeight: 'bold' },
    deleteButton: {
        marginTop: 10,
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButtonText: { color: 'white', fontWeight: 'bold' },
});

export default UserCharactersScreen;
