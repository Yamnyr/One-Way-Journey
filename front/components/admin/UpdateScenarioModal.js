import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { updateScenario } from '../../services/adminService'
import ChoiceForm from './ChoiceForm'

const UpdateScenarioModal = ({ visible, scenarioData, onClose, onSuccess }) => {
    const [updateData, setUpdateData] = useState({
        title: '',
        description: '',
        type: '',
        is_final: false,
        choices: []
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (scenarioData) {
            // Créer une copie profonde pour éviter les problèmes de référence
            setUpdateData(JSON.parse(JSON.stringify(scenarioData)))
        }
    }, [scenarioData])

    const handleUpdateScenario = async () => {
        if (isSubmitting) return // Éviter les soumissions multiples

        setIsSubmitting(true)
        try {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) {
                Alert.alert("Erreur", "Token non trouvé. Veuillez vous reconnecter.")
                setIsSubmitting(false)
                return
            }

            await updateScenario(token, updateData.id, updateData)

            // Vérifier si onSuccess est une fonction avant de l'appeler
            if (typeof onSuccess === 'function') {
                // Passer les données mises à jour au parent
                onSuccess(updateData)
            } else {
                // Si onSuccess n'est pas une fonction, fermer simplement la modal
                onClose()
            }

            // Afficher un message de succès
            Alert.alert("Succès", "Le scénario a été mis à jour avec succès.")
        } catch (error) {
            console.error('Erreur lors de la mise à jour du scénario:', error)
            Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du scénario.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const addChoice = () => {
        setUpdateData({
            ...updateData,
            choices: [...updateData.choices, {
                description: '',
                required_stat: '',
                required_value: '',
                result: '',
                effect_life: 0,
                effect_charisma: 0,
                effect_dexterity: 0,
                effect_intelligence: 0,
                effect_luck: 0,
                is_game_over: false,
                nextScenarioId: null
            }]
        })
    }

    const removeChoice = (index) => {
        const updatedChoices = [...updateData.choices]
        updatedChoices.splice(index, 1)
        setUpdateData({ ...updateData, choices: updatedChoices })
    }

    const updateChoice = (index, updatedChoice) => {
        const updatedChoices = [...updateData.choices]
        updatedChoices[index] = updatedChoice
        setUpdateData({ ...updateData, choices: updatedChoices })
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Modifier le scénario</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalScrollView}>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Titre</Text>
                            <TextInput
                                placeholder="Entrez le titre du scénario"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                value={updateData.title}
                                onChangeText={(text) => setUpdateData({ ...updateData, title: text })}
                                style={styles.formInput}
                                editable={!isSubmitting}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Description</Text>
                            <TextInput
                                placeholder="Décrivez votre scénario"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                multiline
                                numberOfLines={4}
                                value={updateData.description}
                                onChangeText={(text) => setUpdateData({ ...updateData, description: text })}
                                style={[styles.formInput, styles.textArea]}
                                editable={!isSubmitting}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <View style={styles.checkboxContainer}>
                                <Text style={styles.formLabel}>Scénario final</Text>
                                <TouchableOpacity
                                    onPress={() => !isSubmitting && setUpdateData({ ...updateData, is_final: !updateData.is_final })}
                                    style={[styles.checkbox, updateData.is_final && styles.checkboxChecked]}
                                    disabled={isSubmitting}
                                >
                                    {updateData.is_final && <Text style={styles.checkboxMark}>✓</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Type</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={updateData.type}
                                    onValueChange={(itemValue) => !isSubmitting && setUpdateData({ ...updateData, type: itemValue })}
                                    style={styles.picker}
                                    dropdownIconColor="rgb(219, 4, 198)"
                                    enabled={!isSubmitting}
                                >
                                    <Picker.Item label="Sélectionnez un type" value="" />
                                    <Picker.Item label="Destiny" value="destiny" />
                                    <Picker.Item label="Choice" value="choice" />
                                </Picker>
                            </View>
                        </View>

                        {/* Affichage conditionnel de la section "Ajouter un choix" */}
                        {updateData.type === "choice" && (
                            <TouchableOpacity
                                onPress={addChoice}
                                style={[styles.addChoiceButton, isSubmitting && styles.disabledButton]}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.addChoiceButtonText}>➕ Ajouter un choix</Text>
                            </TouchableOpacity>
                        )}

                        {updateData.choices && updateData.choices.map((choice, idx) => (
                            <ChoiceForm
                                key={idx}
                                index={idx}
                                choice={choice}
                                onUpdate={(updatedChoice) => !isSubmitting && updateChoice(idx, updatedChoice)}
                                onRemove={() => !isSubmitting && removeChoice(idx)}
                                disabled={isSubmitting}
                            />
                        ))}
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
                            onPress={handleUpdateScenario}
                            style={[styles.saveButton, isSubmitting && styles.disabledButton]}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.saveButtonText}>
                                {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
                            </Text>
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
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        padding: 10,
    },
    modalContainer: {
        backgroundColor: 'rgba(30, 15, 40, 0.95)',
        borderRadius: 15,
        borderColor: "rgba(183, 45, 230, 0.4)",
        borderWidth: 1,
        shadowColor: "rgb(219, 4, 198)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        maxHeight: '95%',
        width: '95%',
        alignSelf: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(115, 32, 143, 0.5)',
        padding: 20,
    },
    modalTitle: {
        color: "rgb(219, 4, 198)",
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "Orbitron-Bold",
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 0, 225, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalScrollView: {
        padding: 20,
        maxHeight: '75%',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(115, 32, 143, 0.5)',
    },
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        color: 'white',
        fontFamily: "Orbitron-Regular",
        fontSize: 16,
        marginBottom: 8,
    },
    formInput: {
        backgroundColor: 'rgba(60, 20, 80, 0.3)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(115, 32, 143, 0.5)',
        color: 'white',
        padding: 15,
        fontFamily: "Orbitron-Regular",
        fontSize: 16,
        minHeight: 50,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    checkbox: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: 'rgba(115, 32, 143, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 6,
    },
    checkboxChecked: {
        backgroundColor: 'rgba(255, 0, 225, 0.7)',
    },
    checkboxGameOver: {
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
    },
    checkboxMark: {
        color: 'white',
        fontSize: 18,
    },
    pickerContainer: {
        backgroundColor: 'rgba(60, 20, 80, 0.3)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(115, 32, 143, 0.5)',
        overflow: 'hidden',
        marginBottom: 10,
    },
    picker: {
        color: 'white',
        height: 60,
        fontSize: 16,
    },
    addChoiceButton: {
        backgroundColor: 'rgba(115, 32, 143, 0.5)',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 0, 225, 0.3)',
        shadowColor: "rgb(219, 4, 198)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    addChoiceButtonText: {
        color: 'white',
        fontFamily: "Orbitron-Regular",
        fontSize: 18,
    },
    cancelButton: {
        backgroundColor: 'rgba(100, 100, 100, 0.6)',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontFamily: "Orbitron-Regular",
        fontWeight: 'bold',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "rgba(0, 150, 136, 0.7)",
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontFamily: "Orbitron-Regular",
        fontWeight: 'bold',
        fontSize: 16,
    },
    disabledButton: {
        opacity: 0.5,
    }
})

export default UpdateScenarioModal