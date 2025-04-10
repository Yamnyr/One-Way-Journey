import { useState } from "react"
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { createUser } from "../../services/userService"
import AsyncStorage from "@react-native-async-storage/async-storage"

const CreateUserModal = ({ visible, onClose, onCreateSuccess }) => {
    const [userData, setUserData] = useState({
        username: "",
        password: "",
        email: "",
        role: "player",
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (field, value) => {
        setUserData({ ...userData, [field]: value })
    }

    const validateForm = () => {
        if (!userData.username || !userData.password) {
            Alert.alert("Erreur", "Le nom d'utilisateur et le mot de passe sont obligatoires")
            return false
        }
        return true
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) {
                Alert.alert("Erreur", "Vous devez être connecté pour effectuer cette action")
                return
            }

            await createUser(token, userData)
            Alert.alert("Succès", "Utilisateur créé avec succès")
            setUserData({
                username: "",
                password: "",
                email: "",
                role: "player",
            })
            onCreateSuccess()
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur:", error)
            Alert.alert("Erreur", "Impossible de créer l'utilisateur")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Créer un nouvel utilisateur</Text>

                    <ScrollView style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nom d'utilisateur *</Text>
                            <TextInput
                                style={styles.input}
                                value={userData.username}
                                onChangeText={(text) => handleChange("username", text)}
                                placeholder="Nom d'utilisateur"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mot de passe *</Text>
                            <TextInput
                                style={styles.input}
                                value={userData.password}
                                onChangeText={(text) => handleChange("password", text)}
                                placeholder="Mot de passe"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={userData.email}
                                onChangeText={(text) => handleChange("email", text)}
                                placeholder="Email"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Rôle</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={userData.role}
                                    onValueChange={(itemValue) => handleChange("role", itemValue)}
                                    style={styles.picker}
                                    dropdownIconColor="white"
                                >
                                    <Picker.Item label="Joueur" value="player" />
                                    <Picker.Item label="Administrateur" value="admin" />
                                </Picker>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={onClose} disabled={loading}>
                            <Text style={styles.buttonText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonCreate]} onPress={handleSubmit} disabled={loading}>
                            <Text style={styles.buttonText}>{loading ? "Création..." : "Créer"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "90%",
        maxHeight: "80%",
        backgroundColor: "rgba(52, 8, 69, 0.95)",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "rgb(219, 4, 198)",
        marginBottom: 20,
        textAlign: "center",
        fontFamily: "Orbitron-Bold",
    },
    formContainer: {
        maxHeight: 400,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: "white",
        marginBottom: 5,
        fontFamily: "Orbitron-Regular",
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 10,
        padding: 12,
        color: "white",
        borderWidth: 1,
        borderColor: "rgba(107, 31, 132, 0.32)",
        fontFamily: "Orbitron-Regular",
    },
    pickerContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(107, 31, 132, 0.32)",
        overflow: "hidden",
    },
    picker: {
        color: "white",
        height: 50,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        marginHorizontal: 5,
    },
    buttonCancel: {
        backgroundColor: "rgba(158, 158, 158, 0.7)",
    },
    buttonCreate: {
        backgroundColor: "rgba(76, 175, 80, 0.7)",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Orbitron-Regular",
    },
})

export default CreateUserModal
