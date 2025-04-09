import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Image,
    Alert,
    Modal,
    ScrollView,
    TextInput,
} from 'react-native'
import { getAllScenarios, createScenario, deleteScenario } from '../services/adminService'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'

const Admin = () => {
    const navigation = useNavigation()
    const [scenarios, setScenarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [newScenario, setNewScenario] = useState({
        title: '',
        description: '',
        type: '',
        choices: [],
        is_final: false
    })


    useEffect(() => {
        fetchScenarios()
    }, [])

    const fetchScenarios = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) {
                setError("Token non trouvé. Veuillez vous reconnecter.")
                setLoading(false)
                return
            }
            const data = await getAllScenarios(token)
            setScenarios(data.scenarios)
        } catch (err) {
            setError("Erreur lors du chargement des scénarios.")
            console.error("Erreur lors du chargement des scénarios :", err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateScenario = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken")
            await createScenario(token, newScenario)
            setModalVisible(false)
            fetchScenarios()
            setNewScenario({ title: '', description: '', type: '', choices: [], is_final: false })
        } catch (err) {
            Alert.alert("Erreur", "Impossible de créer le scénario.")
            console.error(err)
        }
    }

    const handleDelete = async (scenarioId) => {
        Alert.alert("Confirmation", "Êtes-vous sûr de vouloir supprimer ce scénario ?", [
            { text: "Annuler", style: "cancel" },
            {
                text: "Supprimer",
                style: "destructive",
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem("userToken")
                        await deleteScenario(token, scenarioId)
                        setScenarios(scenarios.filter((s) => s.id !== scenarioId))
                    } catch (err) {
                        Alert.alert("Erreur", "Impossible de supprimer ce scénario.")
                    }
                },
            },
        ])
    }

    const addChoice = () => {
        setNewScenario({
            ...newScenario,
            choices: [...newScenario.choices, {
                description: '',
                required_stat: '',
                required_value: '',
                result: '',
                effect_life: 0,
                effect_charisma: 0,
                effect_dexterity: 0,
                effect_luck: 0,
                is_game_over: false,
                nextScenarioId: null
            }]
        })
    }

    const removeChoice = (index) => {
        const updatedChoices = [...newScenario.choices]
        updatedChoices.splice(index, 1)
        setNewScenario({ ...newScenario, choices: updatedChoices })
    }

    const handleBack = () => {
        navigation.navigate("Accueil")
    }

    // Fonction pour afficher les effets d'un choix
    const renderEffects = (choice) => {
        const effects = []

        if (choice.effect_life) effects.push(`❤️ Vie: ${choice.effect_life > 0 ? '+' : ''}${choice.effect_life}`)
        if (choice.effect_charisma) effects.push(`✨ Charisme: ${choice.effect_charisma > 0 ? '+' : ''}${choice.effect_charisma}`)
        if (choice.effect_dexterity) effects.push(`🏃 Dextérité: ${choice.effect_dexterity > 0 ? '+' : ''}${choice.effect_dexterity}`)
        if (choice.effect_luck) effects.push(`🍀 Chance: ${choice.effect_luck > 0 ? '+' : ''}${choice.effect_luck}`)

        if (choice.is_game_over) effects.push("☠️ Fin de partie")
        if (choice.nextScenarioId) effects.push(`🔜 → Scénario #${choice.nextScenarioId}`)

        return effects.length > 0 ? effects.join(' | ') : "Aucun effet"
    }

    const getChoiceEmoji = (choice) => {
        if (choice.is_game_over) return "☠️"
        if (choice.required_stat) {
            switch (choice.required_stat.toLowerCase()) {
                case 'charisma': return "✨"
                case 'dexterity': return "🏃"
                case 'intelligence': return "🧠"
                case 'luck': return "🍀"
                default: return "🎲"
            }
        }
        return "🎮"
    }

    const renderItem = ({ item }) => {
        return (
            <View style={styles.scenarioCard}>
                <View style={styles.cardContent}>
                    <View style={styles.scenarioHeader}>
                        <Text style={styles.scenarioEmoji}>{item.type === "choix" ? "⚔️" : "🎮"}</Text>
                        <View style={styles.scenarioInfo}>
                            <Text style={styles.scenarioName}>{item.title || "Titre non disponible"}</Text>
                            <View style={styles.metaInfoContainer}>
                                <Text style={styles.idText}>ID: #{item.id}</Text>
                                {item.is_final && (
                                    <View style={styles.finalBadge}>
                                        <Text style={styles.finalBadgeText}>FINAL</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>{item.description}</Text>
                    </View>

                    {/* Affichage des choix avec leurs détails */}
                    {item.choices && item.choices.length > 0 ? (
                        <View style={styles.choicesContainer}>
                            <Text style={styles.choicesTitle}>Choix disponibles:</Text>
                            {item.choices.map((choice, index) => (
                                <View key={index} style={styles.choiceItem}>
                                    <View style={styles.choiceHeader}>
                                        <Text style={styles.choiceEmoji}>{getChoiceEmoji(choice)}</Text>
                                        <Text style={styles.choiceText}>{choice.description}</Text>
                                    </View>

                                    {choice.required_stat && (
                                        <View style={styles.requirementBox}>
                                            <Text style={styles.requirementText}>
                                                Requiert: {choice.required_stat} ≥ {choice.required_value}
                                            </Text>
                                        </View>
                                    )}

                                    <Text style={styles.effectsText}>{renderEffects(choice)}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.noChoicesText}>Aucun choix défini</Text>
                    )}
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => Alert.alert("Info", "Édition du scénario à venir")}>
                        <Text style={styles.buttonText}>Modifier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.id)}>
                        <Text style={styles.buttonText}>Supprimer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    if (loading) return (
        // <ImageBackground source={require("../assets/space.jpg")} style={styles.container} resizeMode="cover">

        <View
            style={styles.container}
            resizeMode="cover"
        >
            <ActivityIndicator size="large" color="rgb(255, 0, 225)" style={styles.loader} />
            {/*</ImageBackground>*/}
        </View>
    )

    return (
        // <ImageBackground source={require("../assets/space.jpg")} style={styles.container} resizeMode="cover">
        <View
            style={styles.container}
            resizeMode="cover"
        >
            <TouchableOpacity style={styles.button2} onPress={handleBack}>
                <Image source={require("../assets/arrowB.png")} style={styles.buttonText2} />
            </TouchableOpacity>

            <Text style={styles.title}>Gestion des Scénarios</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {scenarios.length === 0 ? (
                <Text style={styles.emptyText}>Aucun scénario disponible.</Text>
            ) : (
                <FlatList
                    data={scenarios}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.scrollContent}
                />
            )}

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.createButtonText}>Créer un scénario</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 }}>
                    <ScrollView style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Créer un scénario</Text>

                        <TextInput
                            placeholder="Titre"
                            value={newScenario.title}
                            onChangeText={(text) => setNewScenario({ ...newScenario, title: text })}
                            style={{ borderBottomWidth: 1, marginBottom: 10 }}
                        />

                        <TextInput
                            placeholder="Description"
                            multiline
                            value={newScenario.description}
                            onChangeText={(text) => setNewScenario({ ...newScenario, description: text })}
                            style={{ borderBottomWidth: 1, marginBottom: 10 }}
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                            <Text style={{ marginRight: 10 }}>Scénario final :</Text>
                            <TouchableOpacity
                                onPress={() => setNewScenario({ ...newScenario, is_final: !newScenario.is_final })}
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderWidth: 1,
                                    borderColor: '#333',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: newScenario.is_final ? '#6200ee' : 'transparent',
                                    borderRadius: 4
                                }}
                            >
                                {newScenario.is_final && <Text style={{ color: 'white' }}>✓</Text>}
                            </TouchableOpacity>
                        </View>

                        <Text style={{ marginBottom: 10 }}>Type :</Text>
                        <Picker
                            selectedValue={newScenario.type}
                            onValueChange={(itemValue) => setNewScenario({ ...newScenario, type: itemValue })}
                            style={{ marginBottom: 10 }}
                        >
                            <Picker.Item label="Destiny" value="destiny" />
                            <Picker.Item label="Choice" value="choice" />

                        </Picker>

                        {/* Affichage conditionnel de la section "Ajouter un choix" */}
                        {newScenario.type === "choice" && (
                            <TouchableOpacity
                                onPress={addChoice}
                                style={{
                                    backgroundColor: '#ccc',
                                    padding: 10,
                                    marginVertical: 10,
                                    borderRadius: 10
                                }}
                            >
                                <Text>➕ Ajouter un choix</Text>
                            </TouchableOpacity>
                        )}

                        {newScenario.choices.map((choice, idx) => (
                            <View key={idx} style={{ marginBottom: 15, borderBottomWidth: 1, paddingBottom: 10 }}>
                                <Text style={{ fontWeight: 'bold' }}>Choix {idx + 1}</Text>
                                <TextInput
                                    placeholder="Description"
                                    value={choice.description}
                                    onChangeText={(text) => {
                                        const updated = [...newScenario.choices]
                                        updated[idx].description = text
                                        setNewScenario({ ...newScenario, choices: updated })
                                    }}
                                    style={{ borderBottomWidth: 1, marginBottom: 5 }}
                                />
                                <TextInput
                                    placeholder="Stat requise (ex: charisma, dexterity)"
                                    value={choice.required_stat}
                                    onChangeText={(text) => {
                                        const updated = [...newScenario.choices]
                                        updated[idx].required_stat = text
                                        setNewScenario({ ...newScenario, choices: updated })
                                    }}
                                    style={{ borderBottomWidth: 1, marginBottom: 5 }}
                                />

                                <TextInput
                                    placeholder="Valeur requise"
                                    keyboardType="numeric"
                                    value={choice.required_value?.toString()}
                                    onChangeText={(text) => {
                                        const updated = [...newScenario.choices]
                                        updated[idx].required_value = text
                                        setNewScenario({ ...newScenario, choices: updated })
                                    }}
                                    style={{ borderBottomWidth: 1, marginBottom: 5 }}
                                />

                                <TextInput
                                    placeholder="Résultat affiché"
                                    value={choice.result}
                                    onChangeText={(text) => {
                                        const updated = [...newScenario.choices]
                                        updated[idx].result = text
                                        setNewScenario({ ...newScenario, choices: updated })
                                    }}
                                    style={{ borderBottomWidth: 1, marginBottom: 5 }}
                                />

                                <TextInput
                                    placeholder="Effet sur la vie (ex: -10, +5)"
                                    keyboardType="numeric"
                                    value={choice.effect_life?.toString()}
                                    onChangeText={(text) => {
                                        const updated = [...newScenario.choices]
                                        updated[idx].effect_life = Number(text)
                                        setNewScenario({ ...newScenario, choices: updated })
                                    }}
                                    style={{ borderBottomWidth: 1, marginBottom: 5 }}
                                />

                                <TextInput
                                    placeholder="Effet sur le charisme"
                                    keyboardType="numeric"
                                    value={choice.effect_charisma?.toString()}
                                    onChangeText={(text) => {
                                        const updated = [...newScenario.choices]
                                        updated[idx].effect_charisma = Number(text)
                                        setNewScenario({ ...newScenario, choices: updated })
                                    }}
                                    style={{ borderBottomWidth: 1, marginBottom: 5 }}
                                />

                                <TextInput
                                    placeholder="Effet sur la dextérité"
                                    keyboardType="numeric"
                                    value={choice.effect_dexterity?.toString()}
                                    onChangeText={(text) => {
                                        const updated = [...newScenario.choices]
                                        updated[idx].effect_dexterity = Number(text)
                                        setNewScenario({ ...newScenario, choices: updated })
                                    }}
                                    style={{ borderBottomWidth: 1, marginBottom: 5 }}
                                />

                                <TextInput
                                    placeholder="Effet sur la chance"
                                    keyboardType="numeric"
                                    value={choice.effect_luck?.toString()}
                                    onChangeText={(text) => {
                                        const updated = [...newScenario.choices]
                                        updated[idx].effect_luck = Number(text)
                                        setNewScenario({ ...newScenario, choices: updated })
                                    }}
                                    style={{ borderBottomWidth: 1, marginBottom: 5 }}
                                />

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                    <Text style={{ marginRight: 10 }}>Fin de partie ?</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            const updated = [...newScenario.choices]
                                            updated[idx].is_game_over = !updated[idx].is_game_over
                                            setNewScenario({ ...newScenario, choices: updated })
                                        }}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            borderWidth: 1,
                                            borderColor: '#333',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: choice.is_game_over ? 'red' : 'transparent',
                                            borderRadius: 4
                                        }}
                                    >
                                        {choice.is_game_over && <Text style={{ color: 'white' }}>✓</Text>}
                                    </TouchableOpacity>
                                </View>

                                <TextInput
                                    placeholder="ID du prochain scénario"
                                    keyboardType="numeric"
                                    value={choice.nextScenarioId?.toString()}
                                    onChangeText={(text) => {
                                        const updated = [...newScenario.choices]
                                        updated[idx].nextScenarioId = text ? Number(text) : null
                                        setNewScenario({ ...newScenario, choices: updated })
                                    }}
                                    style={{ borderBottomWidth: 1, marginBottom: 5 }}
                                />

                                <TouchableOpacity
                                    onPress={() => removeChoice(idx)}
                                    style={{
                                        backgroundColor: '#cc0000',
                                        padding: 8,
                                        borderRadius: 6,
                                        marginTop: 10,
                                        alignSelf: 'flex-start'
                                    }}
                                >
                                    <Text style={{ color: 'white' }}>🗑️ Supprimer ce choix</Text>
                                </TouchableOpacity>

                            </View>
                        ))}
                    </ScrollView>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={{ backgroundColor: '#888', padding: 10, borderRadius: 10 }}
                        >
                            <Text style={{ color: '#fff' }}>Annuler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleCreateScenario}
                            style={{ backgroundColor: '#008000', padding: 10, borderRadius: 10 }}
                        >
                            <Text style={{ color: '#fff' }}>Créer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/*</ImageBackground>*/}
        </View >
    )
}

const styles = StyleSheet.create({
    // Styles de base
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        color: 'rgb(219, 4, 198)',
        fontSize: 27,
        textAlign: "center",
        marginVertical: 20,
        fontWeight: "bold",
        textShadowColor: "rgba(255, 147, 239, 0)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 17,
        fontFamily: "Orbitron-Bold",
    },
    scrollContent: {
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: "center",
        fontSize: 18,
        color: "rgb(223, 182, 219)",
        marginTop: 40,
        fontStyle: "italic",
        fontFamily: "Orbitron-Regular",
    },
    errorText: {
        textAlign: "center",
        fontSize: 16,
        color: "rgb(255, 100, 100)",
        marginTop: 20,
        marginBottom: 20,
        fontFamily: "Orbitron-Regular",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    // Cartes de scénarios
    scenarioCard: {
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
    cardContent: {
        flex: 1,
    },
    scenarioHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    scenarioInfo: {
        flex: 1,
    },
    scenarioEmoji: {
        fontSize: 40,
        marginRight: 15,
    },
    scenarioName: {
        fontFamily: "Orbitron-Regular",
        fontSize: 20,
        fontWeight: "bold",
        color: 'rgb(219, 4, 198)',
        marginBottom: 5,
    },
    metaInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    idText: {
        color: "white",
        fontFamily: "Orbitron-Regular",
        marginRight: 10,
    },
    finalBadge: {
        backgroundColor: "rgba(255, 215, 0, 0.8)",
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    finalBadgeText: {
        color: "rgb(30, 15, 40)",
        fontWeight: "bold",
        fontSize: 12,
        fontFamily: "Orbitron-Bold",
    },

    // Description du scénario
    descriptionContainer: {
        backgroundColor: "rgba(40, 6, 65, 0.4)",
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
    },
    descriptionText: {
        color: "rgb(255, 255, 255)",
        fontFamily: "Orbitron-Regular",
        fontSize: 14,
        lineHeight: 20,
    },

    // Choix disponibles
    choicesContainer: {
        marginTop: 15,
    },
    choicesTitle: {
        color: "rgb(255, 255, 255)",
        fontFamily: "Orbitron-Bold",
        fontSize: 16,
        marginBottom: 10,
    },
    choiceItem: {
        backgroundColor: "rgba(60, 20, 80, 0.3)",
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        borderColor: "rgba(115, 32, 143, 0.2)",
        borderWidth: 1,
    },
    choiceHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    choiceEmoji: {
        fontSize: 18,
        marginRight: 8,
    },
    choiceText: {
        color: "rgb(255, 255, 255)",
        fontFamily: "Orbitron-Regular",
        fontSize: 14,
        flex: 1,
    },
    requirementBox: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 5,
        padding: 5,
        marginVertical: 5,
        alignSelf: "flex-start",
    },
    requirementText: {
        color: "rgb(255, 255, 0)",
        fontFamily: "Orbitron-Regular",
        fontSize: 12,
    },
    effectsText: {
        color: "rgb(183, 45, 230)",
        fontFamily: "Orbitron-Regular",
        fontSize: 12,
        marginTop: 5,
    },
    noChoicesText: {
        color: "rgb(223, 182, 219)",
        fontFamily: "Orbitron-Regular",
        fontStyle: "italic",
        textAlign: "center",
        marginTop: 10,
    },

    // Boutons
    button2: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
    },
    buttonText2: {
        opacity: 0.8,
        backgroundColor: "rgba(255, 255, 255, 0)",
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    editButton: {
        backgroundColor: "rgba(52, 152, 219, 0.6)",
        padding: 10,
        borderRadius: 10,
        flex: 1,
        marginRight: 5,
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "rgba(191, 26, 109, 0.6)",
        padding: 10,
        borderRadius: 10,
        flex: 1,
        marginLeft: 5,
        alignItems: "center",
    },
    buttonText: {
        fontFamily: "Orbitron-Regular",
        color: "white",
        fontWeight: "bold",
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
})

export default Admin