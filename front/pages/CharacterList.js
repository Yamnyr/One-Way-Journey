"use client"

import { useEffect, useState } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from "react-native"
import { getUserCharacters, deleteCharacter, createCharacter } from "../services/characterService"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"

// Composants importés
import CharacterCard from "../components/CharacterCard"
import CreateCharacterModal from "../components/CreateCharacterModal"
import LoadingIndicator from "../components/LoadingIndicator"

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
        // Ne rien faire si le personnage est mort
        if (!character.is_alive) return

        if (character.currentScenarioId) {
            try {
                // Stocker l'ID du personnage dans AsyncStorage
                await AsyncStorage.setItem("currentCharacterId", character.id.toString())
                // Naviguer vers la page Scenario avec l'ID du scénario
                navigation.navigate("Scenario", {
                    scenarioId: character.currentScenarioId,
                })
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

    if (loading) return <LoadingIndicator />

    return (
        <View style={styles.container} resizeMode="cover">
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
                        <CharacterCard
                            item={item}
                            onPress={handleNavigateToScenario}
                            onLongPress={handleDelete}
                            getRaceEmoji={getRaceEmoji}
                        />
                    )}
                />
            )}

            {/* Bouton "Créer un personnage" */}
            <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.createButtonText}>Créer un personnage</Text>
            </TouchableOpacity>

            {/* Modal de création de personnage */}
            <CreateCharacterModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCreate={handleCreateCharacter}
                character={newCharacter}
                setCharacter={setNewCharacter}
                speciesList={speciesList}
            />
        </View>
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
    // Boutons spécifiques
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
    button2: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
    },
    buttonText2: {
        opacity: 0.8,
        backgroundColor: "rgba(255, 255, 255, 0)",
        width: 30, // Largeur de l'image
        height: 30, // Hauteur de l'image
        resizeMode: "contain", // Garde les proportions
    },
})

export default UserCharactersScreen
