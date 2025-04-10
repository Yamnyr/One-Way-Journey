import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Image,
    Alert,
} from 'react-native'
import { getAllScenarios, deleteScenario } from '../services/adminService'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ScenarioCard from '../components/admin/ScenarioCard'
import CreateScenarioModal from '../components/admin/CreateScenarioModal'
import UpdateScenarioModal from '../components/admin/UpdateScenarioModal'

const Admin = () => {
    const navigation = useNavigation()
    const [scenarios, setScenarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [createModalVisible, setCreateModalVisible] = useState(false)
    const [updateModalVisible, setUpdateModalVisible] = useState(false)
    const [updateScenarioData, setUpdateScenarioData] = useState({
        title: '',
        description: '',
        type: '',
        is_final: false,
        choices: []
    })
    // Ajout d'un état pour forcer le rafraîchissement
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        fetchScenarios()
    }, [refreshKey]) // Ajout de refreshKey comme dépendance

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

    const handleUpdateScenario = (scenario) => {
        setUpdateScenarioData(scenario)
        setUpdateModalVisible(true)
    }

    const handleCreateSuccess = () => {
        setCreateModalVisible(false)
        setRefreshKey(oldKey => oldKey + 1)
    }

    const handleUpdateSuccess = (updatedScenario) => {
        // Mettre à jour le tableau de scénarios avec le scénario mis à jour
        const updatedScenarios = scenarios.map(scenario =>
            scenario.id === updatedScenario.id ? updatedScenario : scenario
        )
        setScenarios(updatedScenarios)
        setUpdateModalVisible(false)

        // Forcer un rafraîchissement complet des données
        setRefreshKey(oldKey => oldKey + 1)
    }

    const handleBack = () => {
        navigation.navigate("Accueil")
    }

    if (loading) return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="rgb(219, 4, 198)" style={styles.loader} />
        </View>
    )

    return (
        <View style={styles.container}>
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
                    renderItem={({ item }) => (
                        <ScenarioCard
                            scenario={item}
                            onDelete={handleDelete}
                            onUpdate={handleUpdateScenario}
                        />
                    )}
                    contentContainerStyle={styles.scrollContent}
                    extraData={refreshKey} // Ajout de extraData pour forcer le rafraîchissement
                />
            )}

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => setCreateModalVisible(true)}>
                <Text style={styles.createButtonText}>Créer un scénario</Text>
            </TouchableOpacity>

            <CreateScenarioModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onCreateSuccess={handleCreateSuccess}
            />

            <UpdateScenarioModal
                visible={updateModalVisible}
                scenarioData={updateScenarioData}
                onClose={() => setUpdateModalVisible(false)}
                onSuccess={handleUpdateSuccess}
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
    createButton: {
        backgroundColor: "rgba(52, 8, 69, 0.71)",
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "rgba(194, 152, 187, 0)",
        borderColor: "rgba(183, 45, 230, 0.4)",
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