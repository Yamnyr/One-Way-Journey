"use client"

import { useEffect, useState } from "react"
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
    TextInput,
    Image,
    Platform,
    ScrollView,
} from "react-native"
import { getUserCharacters, deleteCharacter, createCharacter } from "../services/characterService"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Picker } from "@react-native-picker/picker"
import { useNavigation } from "@react-navigation/native"

const UserCharactersScreen = () => {
    const [characters, setCharacters] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [newCharacter, setNewCharacter] = useState({
        name: "",
        species: "humain", // Valeur par défaut
    })
    const navigation = useNavigation()

    // Liste des espèces disponibles
    const speciesList = [
        { value: "humain", label: "Humain", emoji: "👨‍🚀" },
        { value: "vulcain", label: "Vulcain", emoji: "🖖" },
        { value: "cyborg", label: "Cyborg", emoji: "🤖" },
        { value: "mutant", label: "Mutant", emoji: "👽" },
        { value: "alien", label: "Alien", emoji: "👾" },
        { value: "batman", label: "Batman", emoji: "🦇" },
    ]

    useEffect(() => {
        fetchCharacters()
    }, [])

    const fetchCharacters = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) {
                setError("Token non trouvé. Veuillez vous reconnecter.")
                setLoading(false)
                return
            }
            const data = await getUserCharacters(token)
            setCharacters(data)
        } catch (err) {
            setError("Erreur lors du chargement des personnages.")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (characterId) => {
        Alert.alert("Confirmation", "Êtes-vous sûr de vouloir supprimer ce personnage ?", [
            { text: "Annuler", style: "cancel" },
            {
                text: "Supprimer",
                style: "destructive",
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem("userToken")
                        await deleteCharacter(characterId, token)
                        setCharacters(characters.filter((c) => c.id !== characterId))
                    } catch (err) {
                        Alert.alert("Erreur", "Impossible de supprimer ce personnage.")
                    }
                },
            },
        ])
    }

    const handleCreateCharacter = async () => {
        if (!newCharacter.name.trim()) {
            Alert.alert("Erreur", "Le nom du personnage est requis.")
            return
        }

        try {
            const token = await AsyncStorage.getItem("userToken")
            const createdCharacter = await createCharacter(newCharacter, token)
            setCharacters([...characters, createdCharacter]) // Ajoute le perso à la liste
            setModalVisible(false)
            setNewCharacter({ name: "", species: "humain" }) // Réinitialise le formulaire
        } catch (err) {
            Alert.alert("Erreur", "Impossible de créer ce personnage.")
        }
    }

    const handleNavigateToScenario = async (character) => {
        if (character.currentScenarioId) {
            try {
                // Stocker l'ID du personnage dans AsyncStorage
                await AsyncStorage.setItem("currentCharacterId", character.id.toString())
                // Naviguer vers la page Scenario avec l'ID du scénario
                navigation.navigate("Scenario", { scenarioId: character.currentScenarioId })
            } catch (error) {
                console.error("Erreur lors du stockage de l'ID du personnage:", error)
                Alert.alert("Erreur", "Impossible de charger le scénario.")
            }
        } else {
            Alert.alert("Information", "Ce personnage n'a pas de scénario actif.")
        }
    }

    const getRaceEmoji = (species) => {
        const speciesLower = species.toLowerCase()
        const found = speciesList.find((item) => item.value === speciesLower)
        return found ? found.emoji : "❓"
    }

    // Rendu du sélecteur d'espèce en fonction de la plateforme
    const renderSpeciesSelector = () => {
        if (Platform.OS === "ios") {
            // Utiliser le Picker sur iOS
            return (
                <Picker
                    selectedValue={newCharacter.species}
                    onValueChange={(itemValue) => setNewCharacter({ ...newCharacter, species: itemValue })}
                    style={styles.picker}
                    itemStyle={{ color: "white", fontFamily: "Orbitron-Regular" }}
                >
                    {speciesList.map((species) => (
                        <Picker.Item key={species.value} label={`${species.label} ${species.emoji}`} value={species.value} />
                    ))}
                </Picker>
            )
        } else {
            // Interface alternative pour Android et autres plateformes
            return (
                <ScrollView style={styles.speciesScrollView}>
                    <View style={styles.speciesGrid}>
                        {speciesList.map((species) => (
                            <TouchableOpacity
                                key={species.value}
                                style={[styles.speciesButton, newCharacter.species === species.value && styles.speciesButtonSelected]}
                                onPress={() => setNewCharacter({ ...newCharacter, species: species.value })}
                            >
                                <Text style={styles.speciesEmoji}>{species.emoji}</Text>
                                <Text
                                    style={[styles.speciesLabel, newCharacter.species === species.value && styles.speciesLabelSelected]}
                                >
                                    {species.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )
        }
    }

    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />

    return (
        <ImageBackground source={require("../assets/space.jpg")} style={styles.container} resizeMode="cover">
            <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate("Accueil")}>
                <Image source={require("../assets/arrowB.png")} style={styles.buttonText2} />
            </TouchableOpacity>
            <Text style={styles.title}>Mes Personnages</Text>

            {characters.length === 0 ? (
                <Text style={styles.emptyText}>Vous n'avez aucun personnage pour le moment.</Text>
            ) : (
                <FlatList
                    data={characters}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.characterCard}>
                            <TouchableOpacity onPress={() => handleNavigateToScenario(item)} style={styles.cardContent}>
                                <View style={styles.characterHeader}>
                                    <Text style={styles.raceEmoji}>{getRaceEmoji(item.species)}</Text>
                                    <View style={styles.characterInfo}>
                                        <Text style={styles.characterName}>{item.name}</Text>
                                        <Text style={styles.characterText}>Espèce : {item.species}</Text>
                                    </View>
                                </View>

                                {/* Stats du personnage */}
                                <View style={styles.statsContainer}>
                                    <View style={styles.statsColumn}>
                                        <Text style={styles.statItem}>❤️ Vie : {item.life || 0}</Text>
                                        <Text style={styles.statItem}>✨ Charisme : {item.charisma || 0}</Text>
                                        <Text style={styles.statItem}>🏃 Dextérité : {item.dexterity || 0}</Text>
                                    </View>
                                    <View style={styles.statsColumn}>
                                        <Text style={styles.statItem}>🧠 Intelligence : {item.intelligence || 0}</Text>
                                        <Text style={styles.statItem}>🍀 Chance : {item.luck || 0}</Text>
                                        <Text style={styles.statItem}>{item.is_alive ? "✅ En vie ! " : "☠️ Mort ..."}</Text>
                                    </View>
                                </View>

                                {/* Scénario actuel */}
                                {item.currentScenarioId && (
                                    <Text style={styles.scenarioText}>🎮 Scénario actuel : #{item.currentScenarioId}</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                                <Text style={styles.buttonText}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            {/* Bouton "Créer un personnage" */}
            <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.createButtonText}>Créer un personnage</Text>
            </TouchableOpacity>

            {/* Modal de création de personnage */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Créer un nouveau personnage</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom du personnage"
                            placeholderTextColor="rgba(255, 255, 255, 0.73)"
                            value={newCharacter.name}
                            onChangeText={(text) => setNewCharacter({ ...newCharacter, name: text })}
                        />
                        <Text style={styles.label}>Espèce :</Text>

                        {/* Sélecteur d'espèce conditionnel */}
                        {renderSpeciesSelector()}

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
    )
}

const styles = StyleSheet.create({
    // Styles de base
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        color: "rgb(255, 0, 225)",
        fontSize: 27,
        textAlign: "center",
        marginVertical: 20,
        fontWeight: "bold",
        textShadowColor: "rgba(255, 147, 239, 0)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 17,
        fontFamily: "Orbitron-Bold",
    },
    emptyText: {
        textAlign: "center",
        fontSize: 18,
        color: "rgb(223, 182, 219)",
        marginTop: 40,
        fontStyle: "italic",
    },

    // Carte personnage
    characterCard: {
        backgroundColor: "rgba(30, 15, 40, 0.85)",
        padding: 18,
        borderRadius: 15,
        marginBottom: 15,
        borderColor: "rgba(115, 32, 143, 0.32)",
        borderWidth: 1,
        shadowColor: "rgba(194, 152, 187, 0)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },
    characterName: {
        fontFamily: "Orbitron-Regular",
        fontSize: 20,
        fontWeight: "bold",
        color: "rgb(255, 0, 230)",
        marginBottom: 8,
    },
    characterText: {
        color: "white",
        marginBottom: 10,
        fontFamily: "Orbitron-Regular",
    },

    // Stats du personnage
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
        backgroundColor: "rgba(40, 6, 65, 0)",
        borderRadius: 8,
        padding: 10,
    },
    statsColumn: {
        flex: 1,
    },
    statItem: {
        color: "rgb(255, 255, 255)",
        marginVertical: 3,
        fontFamily: "Orbitron-Regular",
        fontSize: 12,
    },
    scenarioText: {
        color: "rgb(255, 0, 230)",
        marginVertical: 5,
        fontWeight: "bold",
        fontFamily: "Orbitron-Regular",
    },

    // Boutons génériques
    buttonText: {
        fontFamily: "Orbitron-Regular",
        color: "white",
        fontWeight: "bold",
    },

    // Boutons spécifiques
    deleteButton: {
        marginTop: 10,
        backgroundColor: "rgba(191, 26, 109, 0.6)",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    createButton: {
        backgroundColor: "rgba(52, 8, 69, 0.71)",
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "rgba(194, 152, 187, 0)",
        borderColor: "rgba(107, 31, 132, 0.32)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        borderWidth: 1,
    },
    createButtonText: {
        color: "rgb(255, 255, 255)",
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Orbitron-Regular",
    },

    // Modal
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        backgroundColor: "rgba(30, 15, 40, 0.95)",
        padding: 25,
        borderRadius: 20,
        width: "85%",
        borderColor: "rgba(183, 45, 230, 0.6)",
        borderWidth: 1,
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "rgb(255, 255, 255)",
        fontFamily: "Orbitron-Bold",
    },

    // Formulaire
    label: {
        fontFamily: "Orbitron-Regular",
        fontSize: 16,
        marginBottom: 8,
        color: "rgb(255, 255, 255)",
    },
    input: {
        fontFamily: "Orbitron-Regular",
        borderWidth: 1,
        borderColor: "rgba(75, 23, 93, 0.51)",
        backgroundColor: "rgba(86, 23, 112, 0.76)",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        color: "rgb(255, 255, 255)",
    },
    picker: {
        fontFamily: "Orbitron-Regular",
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: "rgba(75, 23, 93, 0.51)",
        backgroundColor: "rgba(86, 23, 112, 0.76)",
        marginBottom: 20,
        color: "rgb(255, 255, 255)",
    },

    // Layout boutons
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    cancelButton: {
        backgroundColor: "rgba(80, 80, 80, 0.8)",
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: "center",
        fontFamily: "Orbitron-Regular",
    },
    confirmButton: {
        backgroundColor: "rgba(169, 40, 216, 0.65)",
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
        alignItems: "center",
        fontFamily: "Orbitron-Regular",
    },
    cardContent: {
        flex: 1,
    },
    Button2: {
        position: "absolute",
        top: 10,
        left: 11,
        backgroundColor: "rgb(255, 255, 255)",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        shadowColor: "rgba(225, 9, 207, 0.46)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },

    buttonText2: {
        opacity: 0.8,
        backgroundColor: "rgba(255, 255, 255, 0)",
        width: 30, // Largeur de l'image
        height: 30, // Hauteur de l'image
        resizeMode: "contain", // Garde les proportions
    },
    characterHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    characterInfo: {
        flex: 1,
    },
    raceEmoji: {
        fontSize: 40,
        marginRight: 15,
    },

    // Styles pour le sélecteur d'espèce alternatif (Android)
    speciesScrollView: {
        maxHeight: 200,
        marginBottom: 15,
    },
    speciesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    speciesButton: {
        width: "48%",
        backgroundColor: "rgba(60, 20, 80, 0.6)",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(115, 32, 143, 0.32)",
    },
    speciesButtonSelected: {
        backgroundColor: "rgba(169, 40, 216, 0.65)",
        borderColor: "rgba(255, 255, 255, 0.5)",
    },
    speciesEmoji: {
        fontSize: 30,
        marginBottom: 5,
    },
    speciesLabel: {
        color: "white",
        fontFamily: "Orbitron-Regular",
        fontSize: 14,
        textAlign: "center",
    },
    speciesLabelSelected: {
        fontWeight: "bold",
    },
})

export default UserCharactersScreen
