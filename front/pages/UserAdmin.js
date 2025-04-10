import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image, Alert } from "react-native"
import { getAllUsers, deleteUser } from "../services/userService"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import UserCard from "../components/user/UserCard"
import CreateUserModal from "../components/user/CreateUserModal"
import UpdateUserModal from "../components/user/UpdateUserModal"

const UserAdmin = () => {
    const navigation = useNavigation()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [createModalVisible, setCreateModalVisible] = useState(false)
    const [updateModalVisible, setUpdateModalVisible] = useState(false)
    const [updateUserData, setUpdateUserData] = useState({
        id: "",
        username: "",
        email: "",
        role: "player",
    })
    // Ajout d'un état pour forcer le rafraîchissement
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        fetchUsers()
    }, [refreshKey]) // Ajout de refreshKey comme dépendance

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) {
                setError("Token non trouvé. Veuillez vous reconnecter.")
                setLoading(false)
                return
            }
            const data = await getAllUsers(token)
            setUsers(data)
        } catch (err) {
            setError("Erreur lors du chargement des utilisateurs.")
            console.error("Erreur lors du chargement des utilisateurs :", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (userId) => {
        Alert.alert("Confirmation", "Êtes-vous sûr de vouloir supprimer cet utilisateur ?", [
            { text: "Annuler", style: "cancel" },
            {
                text: "Supprimer",
                style: "destructive",
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem("userToken")
                        await deleteUser(token, userId)
                        setUsers(users.filter((u) => u.id !== userId))
                    } catch (err) {
                        Alert.alert("Erreur", "Impossible de supprimer cet utilisateur.")
                    }
                },
            },
        ])
    }

    const handleUpdateUser = (user) => {
        setUpdateUserData(user)
        setUpdateModalVisible(true)
    }

    const handleCreateSuccess = () => {
        setCreateModalVisible(false)
        setRefreshKey((oldKey) => oldKey + 1)
    }

    const handleUpdateSuccess = () => {
        setUpdateModalVisible(false)
        // Forcer un rafraîchissement complet des données
        setRefreshKey((oldKey) => oldKey + 1)
    }

    const handleBack = () => {
        navigation.navigate("AdminHome")
    }

    if (loading)
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="rgb(219, 4, 198)" style={styles.loader} />
            </View>
        )

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button2} onPress={handleBack}>
                <Image source={require("../assets/arrowB.png")} style={styles.buttonText2} />
            </TouchableOpacity>

            <Text style={styles.title}>Gestion des Utilisateurs</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {users.length === 0 ? (
                <Text style={styles.emptyText}>Aucun utilisateur disponible.</Text>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <UserCard user={item} onDelete={handleDelete} onUpdate={handleUpdateUser} />}
                    contentContainerStyle={styles.scrollContent}
                    extraData={refreshKey} // Ajout de extraData pour forcer le rafraîchissement
                />
            )}

            <TouchableOpacity style={styles.createButton} onPress={() => setCreateModalVisible(true)}>
                <Text style={styles.createButtonText}>Créer un utilisateur</Text>
            </TouchableOpacity>

            <CreateUserModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onCreateSuccess={handleCreateSuccess}
            />

            <UpdateUserModal
                visible={updateModalVisible}
                userData={updateUserData}
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
        color: "rgb(219, 4, 198)",
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

export default UserAdmin
