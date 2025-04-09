"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator } from "react-native"
import { getScenarioById } from "../services/scenarioService"
import { getCharacterById, updateCharacter } from "../services/characterService"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ResultModal from "../components/ResultModal"
import GameOverScreen from "../components/GameOverScreen"

const ScenarioScreen = ({ route, navigation }) => {
    const { scenarioId } = route.params
    const [scenario, setScenario] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [character, setCharacter] = useState(null)
    const [characterId, setCharacterId] = useState(null)
    const [resultModalVisible, setResultModalVisible] = useState(false)
    const [currentResult, setCurrentResult] = useState("")
    const [statChanges, setStatChanges] = useState([])
    const [isGameOver, setIsGameOver] = useState(false)
    const [nextScenarioId, setNextScenarioId] = useState(null)
    const [showGameOverScreen, setShowGameOverScreen] = useState(false)

    useEffect(() => {
        fetchData()
    }, [scenarioId])

    const fetchData = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) {
                setError("Token non trouvé. Veuillez vous reconnecter.")
                setLoading(false)
                return
            }

            const currentCharacterId = await AsyncStorage.getItem("currentCharacterId")
            if (!currentCharacterId) {
                setError("Personnage non trouvé. Veuillez sélectionner un personnage.")
                setLoading(false)
                return
            }

            setCharacterId(currentCharacterId)

            const characterData = await getCharacterById(currentCharacterId, token)
            setCharacter(characterData)

            const scenarioData = await getScenarioById(scenarioId, token)
            setScenario(scenarioData)

            // Check if this is a final scenario (game over)
            if (scenarioData.is_final) {
                setShowGameOverScreen(true)
            }
        } catch (err) {
            console.error("Erreur lors du chargement des données:", err)
            setError("Erreur lors du chargement des données.")
        } finally {
            setLoading(false)
        }
    }

    const checkStatRequirement = (choice) => {
        if (!character || !choice.required_stat || !choice.required_value) {
            return true
        }
        return character[choice.required_stat] >= choice.required_value
    }

    const handleChoiceSelection = async (choice) => {
        if (!checkStatRequirement(choice)) {
            setCurrentResult(`Vous avez besoin de ${choice.required_value} en ${choice.required_stat} pour cette action.`)
            setStatChanges([])
            setIsGameOver(false)
            setResultModalVisible(true)
            return
        }

        try {
            const token = await AsyncStorage.getItem("userToken")

            if (character) {
                const updatedStats = { ...character }
                const changes = []

                // Collect stat changes for display
                if (choice.effect_life) {
                    updatedStats.life += choice.effect_life
                    changes.push({ stat: "life", value: choice.effect_life, icon: "❤️" })
                }
                if (choice.effect_charisma) {
                    updatedStats.charisma += choice.effect_charisma
                    changes.push({ stat: "charisma", value: choice.effect_charisma, icon: "✨" })
                }
                if (choice.effect_dexterity) {
                    updatedStats.dexterity += choice.effect_dexterity
                    changes.push({ stat: "dexterity", value: choice.effect_dexterity, icon: "🏃" })
                }
                if (choice.effect_intelligence) {
                    updatedStats.intelligence += choice.effect_intelligence
                    changes.push({ stat: "intelligence", value: choice.effect_intelligence, icon: "🧠" })
                }
                if (choice.effect_luck) {
                    updatedStats.luck += choice.effect_luck
                    changes.push({ stat: "luck", value: choice.effect_luck, icon: "🍀" })
                }

                updatedStats.currentScenarioId = choice.is_game_over ? null : choice.nextScenarioId

                if (choice.is_game_over) {
                    updatedStats.is_alive = false
                }

                await updateCharacter(characterId, updatedStats, token)
                setCharacter(updatedStats)

                // Set up the result modal
                setCurrentResult(choice.result)
                setStatChanges(changes)
                setIsGameOver(choice.is_game_over)
                setNextScenarioId(choice.nextScenarioId)
                setResultModalVisible(true)
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du personnage:", error)
            setCurrentResult("Impossible de mettre à jour le personnage.")
            setStatChanges([])
            setResultModalVisible(true)
        }
    }

    const handleContinue = () => {
        setResultModalVisible(false)

        if (isGameOver) {
            navigation.navigate("characters")
        } else if (nextScenarioId) {
            navigation.replace("Scenario", { scenarioId: nextScenarioId })
        }
    }

    const handleReturnFromGameOver = () => {
        navigation.navigate("characters")
    }

    if (loading) {
        return (
            // <ImageBackground source={require("../assets/space.jpg")} style={styles.container} resizeMode="cover">

            <View
                style={styles.container}
                resizeMode="cover"
            >
                <ActivityIndicator size="large" color="#b72de6" style={styles.loader} />
            {/*</ImageBackground>*/}
            </View>
        )
    }

    if (error || !scenario) {
        return (
            // <ImageBackground source={require("../assets/space.jpg")} style={styles.container} resizeMode="cover">

            <View
                style={styles.container}
                resizeMode="cover"
            >
                <Text style={styles.errorText}>{error || "Scénario non trouvé"}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Retour</Text>
                </TouchableOpacity>
            {/*</ImageBackground>*/}
            </View>
        )
    }

    if (showGameOverScreen) {
        return (
            <GameOverScreen
                message={scenario.description || "Votre aventure s'arrête ici."}
                onReturn={handleReturnFromGameOver}
            />
        )
    }

    return (
        // <ImageBackground source={require("../assets/space.jpg")} style={styles.container} resizeMode="cover">
        <View
            style={styles.container}
            resizeMode="cover"
        >
            <ScrollView style={styles.scrollView}>
                {character && (
                    <View style={styles.characterStatsContainer}>
                        <Text style={styles.characterName}>{character.name}</Text>
                        <View style={styles.statsGrid}>
                            <View style={styles.statsColumn}>
                                <Text style={styles.statBadge}>❤️ Vie: {character.life}</Text>
                                <Text style={styles.statBadge}>✨ Charisme: {character.charisma}</Text>
                                <Text style={styles.statBadge}>🏃 Dextérité: {character.dexterity}</Text>
                            </View>
                            <View style={styles.statsColumn}>
                                <Text style={styles.statBadge}>🧠 Intelligence: {character.intelligence}</Text>
                                <Text style={styles.statBadge}>🍀 Chance: {character.luck}</Text>
                                <Text style={styles.statBadge}>{character.is_alive ? "✅ En vie" : "☠️ Mort"}</Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={styles.scenarioContainer}>
                    <Text style={styles.title}>{scenario.title}</Text>
                    <Text style={styles.description}>{scenario.description}</Text>

                    {scenario.type === "choice" && scenario.choices && (
                        <View style={styles.choicesContainer}>
                            <Text style={styles.choicesTitle}>Que veux-tu faire ?</Text>

                            {scenario.choices.map((choice) => {
                                const isStatSufficient = checkStatRequirement(choice)

                                return (
                                    <TouchableOpacity
                                        key={choice.id}
                                        style={[styles.choiceButton, !isStatSufficient && styles.disabledChoiceButton]}
                                        onPress={() => handleChoiceSelection(choice)}
                                        disabled={!isStatSufficient}
                                    >
                                        <Text style={[styles.choiceText, !isStatSufficient && styles.disabledChoiceText]}>
                                            {choice.description}
                                        </Text>
                                        {choice.required_stat && choice.required_value && (
                                            <Text style={[styles.requirementText, !isStatSufficient && styles.failedRequirementText]}>
                                                Requiert: {choice.required_stat} {choice.required_value}+
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("characters")}>
                <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>

            {/* Result Modal */}
            <ResultModal
                visible={resultModalVisible}
                result={currentResult}
                statChanges={statChanges}
                isGameOver={isGameOver}
                onContinue={handleContinue}
            />
        {/*</ImageBackground>*/}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollView: {
        flex: 1,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
        marginTop: 50,
    },
    characterStatsContainer: {
        backgroundColor: "rgba(30, 15, 40, 0.85)",
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        borderColor: "rgba(183, 45, 230, 0.4)",
        borderWidth: 1,
    },
    characterName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(223, 182, 219)",
        marginBottom: 10,
        textAlign: "center",
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    statsColumn: {
        flex: 1,
    },
    statBadge: {
        backgroundColor: "rgba(40, 20, 55, 0.7)",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        color: "white",
        fontSize: 14,
        marginBottom: 5,
        marginHorizontal: 2,
    },
    scenarioContainer: {
        backgroundColor: "rgba(30, 15, 40, 0.85)",
        padding: 20,
        borderRadius: 15,
        marginVertical: 20,
        borderColor: "rgba(183, 45, 230, 0.4)",
        borderWidth: 1,
        shadowColor: "rgba(194, 152, 187, 0.71)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "rgb(223, 182, 219)",
        marginBottom: 15,
        textAlign: "center",
        textShadowColor: "rgba(183, 45, 230, 0.65)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    description: {
        fontSize: 18,
        color: "white",
        marginBottom: 20,
        lineHeight: 24,
    },
    choicesContainer: {
        marginTop: 20,
    },
    choicesTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "rgb(223, 182, 219)",
        marginBottom: 15,
    },
    choiceButton: {
        backgroundColor: "rgba(40, 20, 55, 0.7)",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderColor: "rgba(183, 45, 230, 0.3)",
        borderWidth: 1,
    },
    disabledChoiceButton: {
        backgroundColor: "rgba(40, 20, 55, 0.4)",
        borderColor: "rgba(183, 45, 230, 0.1)",
    },
    choiceText: {
        color: "white",
        fontSize: 16,
    },
    disabledChoiceText: {
        color: "rgba(255, 255, 255, 0.5)",
    },
    requirementText: {
        color: "rgba(223, 182, 219, 0.7)",
        fontSize: 14,
        marginTop: 5,
        fontStyle: "italic",
    },
    failedRequirementText: {
        color: "rgba(255, 100, 100, 0.7)",
    },
    backButton: {
        backgroundColor: "rgba(169, 40, 216, 0.65)",
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        marginVertical: 20,
        shadowColor: "rgba(194, 152, 187, 0.71)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
})

export default ScenarioScreen
