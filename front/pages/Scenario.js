import { useEffect, useState } from "react"
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native"
import { getScenarioById } from "../services/scenarioService"
import { getCharacterById, updateCharacter } from "../services/characterService"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Composants importés
import ResultModal from "../components/ResultModal"
import GameOverScreen from "../components/GameOverScreen"
import CharacterStats from "../components/scenario/CharacterStats"
import ScenarioDescription from "../components/scenario/ScenarioDescription"
import ChoicesList from "../components/scenario/ChoicesList"
import ErrorView from "../components/scenario/ErrorView"
import LoadingView from "../components/LoadingView"

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
        return <LoadingView />
    }

    if (error || !scenario) {
        return <ErrorView message={error || "Scénario non trouvé"} onBack={() => navigation.goBack()} />
    }

    if (showGameOverScreen) {
        return (
            <GameOverScreen
                message={scenario.description || "Votre aventure s'arrête ici."}
                onReturn={handleReturnFromGameOver}
                isSuccess={character?.life > 0}
            />
        )
    }

    return (
        <View style={styles.container} resizeMode="cover">
            <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate("characters")}>
                <Image source={require("../assets/arrowB.png")} style={styles.buttonText2} />
            </TouchableOpacity>

            <CharacterStats character={character} />

            <ScrollView style={styles.scrollView}>
                <View style={styles.scenarioContainer}>
                    <ScenarioDescription title={scenario.title} description={scenario.description} />

                    {scenario.type === "choice" && scenario.choices && (
                        <ChoicesList
                            choices={scenario.choices}
                            onChoiceSelect={handleChoiceSelection}
                            checkStatRequirement={checkStatRequirement}
                        />
                    )}
                </View>
            </ScrollView>

            <ResultModal
                visible={resultModalVisible}
                result={currentResult}
                statChanges={statChanges}
                isGameOver={isGameOver}
                onContinue={handleContinue}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 70,
    },
    scrollView: {
        flex: 1,
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
        fontFamily: "Orbitron-Regular",
    },
    button2: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
    },
    buttonText2: {
        fontFamily: "Orbitron-Regular",
        opacity: 0.8,
        backgroundColor: "rgba(255, 255, 255, 0)",
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
})

export default ScenarioScreen
