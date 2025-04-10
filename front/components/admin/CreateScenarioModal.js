import React, { useState } from 'react'
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
import { createScenario } from '../../services/adminService'
import ChoiceForm from './ChoiceForm'

const CreateScenarioModal = ({ visible, onClose, onCreateSuccess }) => {
    const [newScenario, setNewScenario] = useState({
        title: '',
        description: '',
        type: '',
        choices: [],
        is_final: false
    })

    const resetForm = () => {
        setNewScenario({
            title: '',
            description: '',
            type: '',
            choices: [],
            is_final: false
        })
    }

    const handleCreateScenario = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken")
            await createScenario(token, newScenario)
            resetForm()
            onCreateSuccess()
        } catch (err) {
            Alert.alert("Erreur", "Impossible de créer le scénario.")
            console.error(err)
        }
    }

    const addChoice = () => {
        setNewScenario({
            ...newScenario,
            choices: [...newScenario.choices, {
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
        const updatedChoices = [...newScenario.choices]
        updatedChoices.splice(index, 1)
        setNewScenario({ ...newScenario, choices: updatedChoices })
    }

    const updateChoice = (index, updatedChoice) => {
        const updatedChoices = [...newScenario.choices]
        updatedChoices[index] = updatedChoice
        setNewScenario({ ...newScenario, choices: updatedChoices })
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Créer un scénario</Text>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.closeButton}
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
                                value={newScenario.title}
                                onChangeText={(text) => setNewScenario({ ...newScenario, title: text })}
                                style={styles.formInput}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Description</Text>
                            <TextInput
                                placeholder="Décrivez votre scénario"
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                multiline
                                numberOfLines={4}
                                value={newScenario.description}
                                onChangeText={(text) => setNewScenario({ ...newScenario, description: text })}
                                style={[styles.formInput, styles.textArea]}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <View style={styles.checkboxContainer}>
                                <Text style={styles.formLabel}>Scénario final</Text>
                                <TouchableOpacity
                                    onPress={() => setNewScenario({ ...newScenario, is_final: !newScenario.is_final })}
                                    style={[
                                        styles.checkbox,
                                        newScenario.is_final && styles.checkboxChecked
                                    ]}
                                >
                                    {newScenario.is_final && <Text style={styles.checkboxMark}>✓</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Type</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={newScenario.type}
                                    onValueChange={(itemValue) => setNewScenario({ ...newScenario, type: itemValue })}
                                    style={styles.picker}
                                    dropdownIconColor="rgb(255, 0, 225)"
                                >
                                    <Picker.Item label="Sélectionnez un type" value="" />
                                    <Picker.Item label="Destiny" value="destiny" />
                                    <Picker.Item label="Choice" value="choice" />
                                </Picker>
                            </View>
                        </View>

                        {/* Affichage conditionnel de la section "Ajouter un choix" */}
                        {newScenario.type === "choice" && (
                            <TouchableOpacity
                                onPress={addChoice}
                                style={styles.addChoiceButton}
                            >
                                <Text style={styles.addChoiceButtonText}>➕ Ajouter un choix</Text>
                            </TouchableOpacity>
                        )}

                        {newScenario.choices.map((choice, idx) => (
                            <ChoiceForm
                                key={idx}
                                index={idx}
                                choice={choice}
                                onUpdate={(updatedChoice) => updateChoice(idx, updatedChoice)}
                                onRemove={() => removeChoice(idx)}
                            />
                        ))}
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleCreateScenario}
                            style={styles.saveButton}
                        >
                            <Text style={styles.saveButtonText}>Créer</Text>
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
        borderColor: "rgba(115, 32, 143, 0.5)",
        borderWidth: 1,
        shadowColor: "rgb(255, 0, 225)",
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
        color: "rgb(255, 0, 225)",
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
        borderColor: 'rgba(115, 32, 143, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 6,
    },
    checkboxChecked: {
        backgroundColor: 'rgba(255, 0, 225, 0.7)',
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
        shadowColor: "rgb(255, 0, 225)",
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
        backgroundColor: 'rgba(0, 200, 100, 0.6)',
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
})

export default CreateScenarioModal