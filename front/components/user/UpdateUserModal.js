import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Alert } from "react-native"
import { Picker } from "@react-native-picker/picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { updateUser } from "../../services/userService"

const UpdateUserModal = ({ visible, userData, onClose, onSuccess }) => {
    const [updateData, setUpdateData] = useState({
        username: "",
        email: "",
        role: "player",
        password: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (userData) {
            // Créer une copie pour éviter les problèmes de référence
            setUpdateData({
                ...userData,
                password: "", // Vide par défaut car on ne veut pas afficher le mot de passe actuel
            })
        }
    }, [userData])

    const handleUpdateUser = async () => {
        if (isSubmitting) return // Éviter les soumissions multiples

        if (!updateData.username) {
            Alert.alert("Erreur", "Le nom d'utilisateur est obligatoire")
            return
        }

        setIsSubmitting(true)
        try {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) {
                Alert.alert("Erreur", "Token non trouvé. Veuillez vous reconnecter.")
                setIsSubmitting(false)
                return
            }

            // Si le mot de passe est vide, on ne l'envoie pas dans la requête
            const dataToUpdate = { ...updateData }
            if (!dataToUpdate.password) {
                delete dataToUpdate.password
            }

            await updateUser(token, updateData.id, dataToUpdate)

            // Vérifier si onSuccess est une fonction avant de l'appeler
            if (typeof onSuccess === "function") {
                onSuccess()
            } else {
                // Si onSuccess n'est pas une fonction, fermer simplement la modal
                onClose()
            }

            // Afficher un message de succès
            Alert.alert("Succès", "L'utilisateur a été mis à jour avec succès.")
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
            Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour de l'utilisateur.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Modifier l'utilisateur</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton} disabled={isSubmitting}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalScrollView}>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Nom d'utilisateur *</Text>
                            <TextInput
                                placeholder="Entrez le nom d'utilisateur"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                value={updateData.username}
                                onChangeText={(text) => setUpdateData({ ...updateData, username: text })}
                                style={styles.formInput}
                                editable={!isSubmitting}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Nouveau mot de passe (laisser vide pour ne pas changer)</Text>
                            <TextInput
                                placeholder="Nouveau mot de passe"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                value={updateData.password}
                                onChangeText={(text) => setUpdateData({ ...updateData, password: text })}
                                style={styles.formInput}
                                secureTextEntry
                                editable={!isSubmitting}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Email</Text>
                            <TextInput
                                placeholder="Entrez l'email"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                value={updateData.email}
                                onChangeText={(text) => setUpdateData({ ...updateData, email: text })}
                                style={styles.formInput}
                                keyboardType="email-address"
                                editable={!isSubmitting}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Rôle</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={updateData.role}
                                    onValueChange={(itemValue) => !isSubmitting && setUpdateData({ ...updateData, role: itemValue })}
                                    style={styles.picker}
                                    dropdownIconColor="rgb(255, 0, 225)"
                                    enabled={!isSubmitting}
                                >
                                    <Picker.Item label="Joueur" value="player" />
                                    <Picker.Item label="Administrateur" value="admin" />
                                </Picker>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.cancelButton, isSubmitting && styles.disabledButton]}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleUpdateUser}
                            style={[styles.saveButton, isSubmitting && styles.disabledButton]}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.saveButtonText}>{isSubmitting ? "Sauvegarde..." : "Sauvegarder"}</Text>
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
    disabledButton: {
        opacity: 0.5,
    },
})

export default UpdateUserModal
