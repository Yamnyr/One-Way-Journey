import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ImageBackground,
    Modal,
    TextInput
} from 'react-native';
import { getUserCharacters, deleteCharacter, createCharacter } from '../services/characterService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const UserCharactersScreen = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newCharacter, setNewCharacter] = useState({
        name: '',
        species: 'Humain', // Valeur par défaut
    });

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
                            setCharacters(characters.filter(c => c.id !== characterId));
                        } catch (err) {
                            Alert.alert("Erreur", "Impossible de supprimer ce personnage.");
                        }
                    },
                },
            ]
        );
    };

    const handleCreateCharacter = async () => {
        if (!newCharacter.name.trim()) {
            Alert.alert("Erreur", "Le nom du personnage est requis.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            const createdCharacter = await createCharacter(newCharacter, token);
            setCharacters([...characters, createdCharacter]); // Ajoute le perso à la liste
            setModalVisible(false);
            setNewCharacter({ name: '', species: 'Humain' }); // Réinitialise le formulaire
        } catch (err) {
            Alert.alert("Erreur", "Impossible de créer ce personnage.");
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;

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
                            <Text style={styles.characterText}>Espèce: {item.species}</Text>

                            {/* Stats du personnage */}
                            <View style={styles.statsContainer}>
                                <View style={styles.statsColumn}>
                                    <Text style={styles.statItem}>❤️ Vie: {item.life || 0}</Text>
                                    <Text style={styles.statItem}>✨ Charisme: {item.charisma || 0}</Text>
                                    <Text style={styles.statItem}>🏃 Dextérité: {item.dexterity || 0}</Text>
                                </View>
                                <View style={styles.statsColumn}>
                                    <Text style={styles.statItem}>🧠 Intelligence: {item.intelligence || 0}</Text>
                                    <Text style={styles.statItem}>🍀 Chance: {item.luck || 0}</Text>
                                    <Text style={styles.statItem}>
                                        {item.is_alive ? '✅ En vie' : '☠️ Mort'}
                                    </Text>
                                </View>
                            </View>

                            {/* Scénario actuel */}
                            {item.currentScenarioId && (
                                <Text style={styles.scenarioText}>
                                    🎮 Scénario actuel: #{item.currentScenarioId}
                                </Text>
                            )}

                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(item.id)}
                            >
                                <Text style={styles.buttonText}>❌ Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            {/* Bouton "Créer un personnage" */}
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.createButtonText}>➕ Créer un personnage</Text>
            </TouchableOpacity>

            {/* Modal de création de personnage */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Créer un nouveau personnage</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom du personnage"
                            placeholderTextColor="gray"
                            value={newCharacter.name}
                            onChangeText={(text) => setNewCharacter({ ...newCharacter, name: text })}
                        />
                        <Text style={styles.label}>Espèce :</Text>
                        <Picker
                            selectedValue={newCharacter.species}
                            onValueChange={(itemValue) =>
                                setNewCharacter({ ...newCharacter, species: itemValue })
                            }
                            style={styles.picker}
                        >
                            <Picker.Item label="Humain" value="humain" />
                            <Picker.Item label="vulcain" value="vulcain" />
                            <Picker.Item label="Cyborg" value="cyborg" />
                            <Picker.Item label="Mutant" value="mutant" />
                            <Picker.Item label="Alien" value="alien" />
                            <Picker.Item label="Batman" value="batman" />
                        </Picker>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleCreateCharacter}>
                                <Text style={styles.buttonText}>Créer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    // Styles de base
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        color: 'rgb(183, 45, 230)',
        fontSize: 27,
        textAlign: 'center',
        marginVertical: 20,
        fontWeight: 'bold',
        textShadowColor: 'rgba(255, 147, 239, 0.65)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 17,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'rgb(223, 182, 219)',
        marginTop: 40,
        fontStyle: 'italic',
    },

    // Carte personnage
    characterCard: {
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
    characterName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(223, 182, 219)',
        marginBottom: 8,
    },
    characterText: {
        color: 'white',
        marginBottom: 10,
    },

    // Stats du personnage
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        backgroundColor: 'rgba(40, 20, 55, 0.7)',
        borderRadius: 8,
        padding: 10,
    },
    statsColumn: {
        flex: 1,
    },
    statItem: {
        color: 'rgb(223, 182, 219)',
        marginVertical: 3,
    },
    scenarioText: {
        color: 'rgb(223, 182, 219)',
        marginVertical: 5,
        fontWeight: 'bold',
    },

    // Boutons génériques
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },

    // Boutons spécifiques
    deleteButton: {
        marginTop: 10,
        backgroundColor: 'rgba(230, 45, 70, 0.6)',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    createButton: {
        backgroundColor: 'rgba(169, 40, 216, 0.65)',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: 'rgba(194, 152, 187, 0.71)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    createButtonText: {
        color: 'rgb(223, 182, 219)',
        fontSize: 18,
        fontWeight: 'bold',
    },

    // Modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: 'rgba(30, 15, 40, 0.95)',
        padding: 25,
        borderRadius: 20,
        width: '85%',
        borderColor: 'rgba(183, 45, 230, 0.6)',
        borderWidth: 1,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'rgb(183, 45, 230)',
    },

    // Formulaire
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: 'rgb(223, 182, 219)',
    },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(183, 45, 230, 0.4)',
        backgroundColor: 'rgba(30, 5, 40, 0.6)',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        color: 'white',
    },
    picker: {
        backgroundColor: 'rgba(30, 5, 40, 0.6)',
        marginBottom: 20,
        color: 'white',
    },

    // Layout boutons
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    cancelButton: {
        backgroundColor: 'rgba(80, 80, 80, 0.8)',
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: 'rgba(169, 40, 216, 0.65)',
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    }
});

export default UserCharactersScreen;