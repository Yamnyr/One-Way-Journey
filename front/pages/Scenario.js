import { useEffect, useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native"
import { getScenarioById } from "../services/scenarioService"
import AsyncStorage from "@react-native-async-storage/async-storage"

const ScenarioScreen = ({ route, navigation }) => {
    const { scenarioId } = route.params
    const [scenario, setScenario] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [character, setCharacter] = useState(null)

    useEffect(() => {
        fetchScenario()
    }, [scenarioId])

    const fetchScenario = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) {
                setError("Token non trouvé. Veuillez vous reconnecter.")
                setLoading(false)
                return
            }

            // Récupérer les données du personnage si nécessaire (pour vérifier les stats)
            // Cette partie dépend de votre implémentation
            // const characterData = await AsyncStorage.getItem('currentCharacter');
            // if (characterData) {
            //     setCharacter(JSON.parse(characterData));
            // }

            const data = await getScenarioById(scenarioId, token)
            setScenario(data)
        } catch (err) {
            console.error("Erreur lors du chargement du scénario:", err)
            setError("Erreur lors du chargement du scénario.")
        } finally {
            setLoading(false)
        }
    }

    const handleChoiceSelection = (choice) => {
        // Vérifier si le personnage a les stats requises
        // Cette partie dépend de votre implémentation
        // if (character && choice.required_stat && choice.required_value) {
        //     if (character[choice.required_stat] < choice.required_value) {
        //         Alert.alert(
        //             "Stat insuffisante",
        //             `Vous avez besoin de ${choice.required_value} en ${choice.required_stat} pour cette action.`
        //         );
        //         return;
        //     }
        // }

        // Afficher le résultat du choix
        Alert.alert("Résultat", choice.result, [
            {
                text: "Continuer",
                onPress: () => {
                    // Si le choix mène à un game over
                    if (choice.is_game_over) {
                        Alert.alert("Game Over", "Votre aventure s'arrête ici.", [
                            { text: "Retour", onPress: () => navigation.goBack() },
                        ])
                    }
                    // Sinon, naviguer vers le prochain scénario
                    else if (choice.nextScenarioId) {
                        navigation.replace("Scenario", { scenarioId: choice.nextScenarioId })
                    } else {
                        navigation.goBack()
                    }
                },
            },
        ])
    }

    if (loading) {
        return (
            <ImageBackground source={require("../assets/space.jpg")} style={styles.container} resizeMode="cover">
                <ActivityIndicator size="large" color="#b72de6" style={styles.loader} />
            </ImageBackground>
        )
    }

    if (error || !scenario) {
        return (
            <ImageBackground source={require("../assets/space.jpg")} style={styles.container} resizeMode="cover">
                <Text style={styles.errorText}>{error || "Scénario non trouvé"}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Retour</Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }

    return (
        <ImageBackground source={require("../assets/space.jpg")} style={styles.container} resizeMode="cover">
            <ScrollView style={styles.scrollView}>
                <View style={styles.scenarioContainer}>
                    <Text style={styles.title}>{scenario.title}</Text>
                    <Text style={styles.description}>{scenario.description}</Text>

                    {scenario.type === "choice" && scenario.choices && (
                        <View style={styles.choicesContainer}>
                            <Text style={styles.choicesTitle}>Que veux-tu faire ?</Text>

                            {scenario.choices.map((choice) => (
                                <TouchableOpacity
                                    key={choice.id}
                                    style={styles.choiceButton}
                                    onPress={() => handleChoiceSelection(choice)}
                                >
                                    <Text style={styles.choiceText}>{choice.description}</Text>
                                    {choice.required_stat && choice.required_value && (
                                        <Text style={styles.requirementText}>
                                            Requiert: {choice.required_stat} {choice.required_value}+
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>
        </ImageBackground>
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
    choiceText: {
        color: "white",
        fontSize: 16,
    },
    requirementText: {
        color: "rgba(223, 182, 219, 0.7)",
        fontSize: 14,
        marginTop: 5,
        fontStyle: "italic",
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
