import { useState, useEffect } from "react"
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { updateUser } from "../../services/userService"
import AsyncStorage from "@react-native-async-storage/async-storage"

const UpdateUserModal = ({ visible, userData, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        role: "player",
        password: "", // Optionnel pour la mise à jour
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (userData) {
            setFormData({
                username: userData.username || "",
                email: userData.email || "",
                role: userData.role || "player",
                password: "", // Vide par défaut car on ne veut pas afficher le mot de passe actuel
            })
        }
    }, [userData])

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value })
    }

    const validateForm = () => {
        if (!formData.username) {
            Alert.alert("Erreur", "Le nom d'utilisateur est obligatoire")
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

            // Si le mot de passe est vide, on ne l'envoie pas dans la requête
            const dataToUpdate = { ...formData }
            if (!dataToUpdate.password) {
                delete dataToUpdate.password
            }

            await updateUser(token, userData.id, dataToUpdate)
            Alert.alert("Succès", "Utilisateur mis à jour avec succès")
            onSuccess()
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
            Alert.alert("Erreur", "Impossible de mettre à jour l'utilisateur")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Modifier l'utilisateur</Text>

                    <ScrollView style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nom d'utilisateur *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.username}
                                onChangeText={(text) => handleChange("username", text)}
                                placeholder="Nom d'utilisateur"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nouveau mot de passe (laisser vide pour ne pas changer)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.password}
                                onChangeText={(text) => handleChange("password", text)}
                                placeholder="Nouveau mot de passe"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.email}
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
                                    selectedValue={formData.role}
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
                        <TouchableOpacity style={[styles.button, styles.buttonUpdate]} onPress={handleSubmit} disabled={loading}>
                            <Text style={styles.buttonText}>{loading ? "Mise à jour..." : "Mettre à jour"}</Text>
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
    buttonUpdate: {
        backgroundColor: "rgba(0, 150, 136, 0.7)",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Orbitron-Regular",
    },
})

export default UpdateUserModal
