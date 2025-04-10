import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Alert } from "react-native"
import { Picker } from "@react-native-picker/picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createUser } from "../../services/userService"

const CreateUserModal = ({ visible, onClose, onCreateSuccess }) => {
    const [userData, setUserData] = useState({
        username: "",
        password: "",
        email: "",
        role: "player",
    })
    const [loading, setLoading] = useState(false)

    const resetForm = () => {
        setUserData({
            username: "",
            password: "",
            email: "",
            role: "player",
        })
    }

    const handleCreateUser = async () => {
        if (!userData.username || !userData.password) {
            Alert.alert("Erreur", "Le nom d'utilisateur et le mot de passe sont obligatoires")
            return
        }

        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) {
                Alert.alert("Erreur", "Vous devez être connecté pour effectuer cette action")
                setLoading(false)
                return
            }

            await createUser(token, userData)
            Alert.alert("Succès", "Utilisateur créé avec succès")
            resetForm()
            onCreateSuccess()
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur:", error)
            Alert.alert("Erreur", "Impossible de créer l'utilisateur")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={handleClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Créer un utilisateur</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalScrollView}>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Nom d'utilisateur *</Text>
                            <TextInput
                                placeholder="Entrez le nom d'utilisateur"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                value={userData.username}
                                onChangeText={(text) => setUserData({ ...userData, username: text })}
                                style={styles.formInput}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Mot de passe *</Text>
                            <TextInput
                                placeholder="Entrez le mot de passe"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                value={userData.password}
                                onChangeText={(text) => setUserData({ ...userData, password: text })}
                                style={styles.formInput}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Email</Text>
                            <TextInput
                                placeholder="Entrez l'email"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                value={userData.email}
                                onChangeText={(text) => setUserData({ ...userData, email: text })}
                                style={styles.formInput}
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Rôle</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={userData.role}
                                    onValueChange={(itemValue) => setUserData({ ...userData, role: itemValue })}
                                    style={styles.picker}
                                    dropdownIconColor="rgb(255, 0, 225)"
                                >
                                    <Picker.Item label="Joueur" value="player" />
                                    <Picker.Item label="Administrateur" value="admin" />
                                </Picker>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleCreateUser} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>{loading ? "Création..." : "Créer"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.85)",
        justifyContent: "center",
        padding: 10,
    },
    modalContainer: {
        backgroundColor: "rgba(30, 15, 40, 0.95)",
        borderRadius: 15,
        borderColor: "rgba(115, 32, 143, 0.5)",
        borderWidth: 1,
        shadowColor: "rgb(255, 0, 225)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        maxHeight: "95%",
        width: "95%",
        alignSelf: "center",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(115, 32, 143, 0.5)",
        padding: 20,
    },
    modalTitle: {
        color: "rgb(255, 0, 225)",
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "Orbitron-Bold",
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255, 0, 225, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    closeButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    modalScrollView: {
        padding: 20,
        maxHeight: "75%",
    },
    modalFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "rgba(115, 32, 143, 0.5)",
    },
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        color: "white",
        fontFamily: "Orbitron-Regular",
        fontSize: 16,
        marginBottom: 8,
    },
    formInput: {
        backgroundColor: "rgba(60, 20, 80, 0.3)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(115, 32, 143, 0.5)",
        color: "white",
        padding: 15,
        fontFamily: "Orbitron-Regular",
        fontSize: 16,
        minHeight: 50,
    },
    pickerContainer: {
        backgroundColor: "rgba(60, 20, 80, 0.3)",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(115, 32, 143, 0.5)",
        overflow: "hidden",
        marginBottom: 10,
    },
    picker: {
        color: "white",
        height: 60,
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: "rgba(100, 100, 100, 0.6)",
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "white",
        fontFamily: "Orbitron-Regular",
        fontWeight: "bold",
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "rgba(0, 150, 136, 0.7)",
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
        alignItems: "center",
    },
    saveButtonText: {
        color: "white",
        fontFamily: "Orbitron-Regular",
        fontWeight: "bold",
        fontSize: 16,
    },
})

export default CreateUserModal
