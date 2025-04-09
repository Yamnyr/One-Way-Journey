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
    Modal,
    ScrollView,
    TextInput,
} from 'react-native'
import { getAllScenarios, createScenario, deleteScenario, updateScenario } from '../services/adminService'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'

const Admin = () => {
    const navigation = useNavigation()
    const [scenarios, setScenarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [newScenario, setNewScenario] = useState({
        title: '',
        description: '',
        type: '',
        choices: [],
        is_final: false
    })
    const [updateScenarioData, setUpdateScenarioData] = useState({
        title: '',
        description: '',
        type: '',
        is_final: false,
        choices: []
    });
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);


    useEffect(() => {
        fetchScenarios()
    }, [])

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

    const handleCreateScenario = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken")
            await createScenario(token, newScenario)
            setModalVisible(false)
            fetchScenarios()
            setNewScenario({ title: '', description: '', type: '', choices: [], is_final: false })
        } catch (err) {
            Alert.alert("Erreur", "Impossible de créer le scénario.")
            console.error(err)
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

    const handleUpdateScenario = (scenario) => {
        setUpdateScenarioData(scenario)
        setUpdateModalVisible(true)
    }

    const handleUpdateScenarioSave = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken")
            if (!token) {
                setError("Token non trouvé. Veuillez vous reconnecter.")
                setLoading(false)
                return
            }
            const response = await updateScenario(token, updateScenarioData.id, updateScenarioData);
            const updatedScenarios = scenarios.map(scenario =>
                scenario.id === updateScenarioData.id ? { ...scenario, ...updateScenarioData } : scenario
            );

            setScenarios(updatedScenarios);
            setUpdateModalVisible(false);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du scénario:', error);
            setError('Une erreur est survenue lors de la mise à jour du scénario.');
        }
    };


    const handleBack = () => {
        navigation.navigate("Accueil")
    }

    // Fonction pour afficher les effets d'un choix
    const renderEffects = (choice) => {
        const effects = []

        if (choice.effect_life) effects.push(`❤️ Vie: ${choice.effect_life > 0 ? '+' : ''}${choice.effect_life}`)
        if (choice.effect_charisma) effects.push(`✨ Charisme: ${choice.effect_charisma > 0 ? '+' : ''}${choice.effect_charisma}`)
        if (choice.effect_dexterity) effects.push(`🏃 Dextérité: ${choice.effect_dexterity > 0 ? '+' : ''}${choice.effect_dexterity}`)
        if (choice.effect_luck) effects.push(`🍀 Chance: ${choice.effect_luck > 0 ? '+' : ''}${choice.effect_luck}`)

        if (choice.is_game_over) effects.push("☠️ Fin de partie")
        if (choice.nextScenarioId) effects.push(`🔜 → Scénario #${choice.nextScenarioId}`)

        return effects.length > 0 ? effects.join(' | ') : "Aucun effet"
    }

    const getChoiceEmoji = (choice) => {
        if (choice.is_game_over) return "☠️"
        if (choice.required_stat) {
            switch (choice.required_stat.toLowerCase()) {
                case 'charisma': return "✨"
                case 'dexterity': return "🏃"
                case 'intelligence': return "🧠"
                case 'luck': return "🍀"
                default: return "🎲"
            }
        }
        return "🎮"
    }

    const renderItem = ({ item }) => {
        return (
            <View style={styles.scenarioCard}>
                <View style={styles.cardContent}>
                    <View style={styles.scenarioHeader}>
                        <Text style={styles.scenarioEmoji}>{item.type === "choix" ? "⚔️" : "🎮"}</Text>
                        <View style={styles.scenarioInfo}>
                            <Text style={styles.scenarioName}>{item.title || "Titre non disponible"}</Text>
                            <View style={styles.metaInfoContainer}>
                                <Text style={styles.idText}>ID: #{item.id}</Text>
                                {item.is_final && (
                                    <View style={styles.finalBadge}>
                                        <Text style={styles.finalBadgeText}>FINAL</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>{item.description}</Text>
                    </View>

                    {/* Affichage des choix avec leurs détails */}
                    {item.choices && item.choices.length > 0 ? (
                        <View style={styles.choicesContainer}>
                            <Text style={styles.choicesTitle}>Choix disponibles:</Text>
                            {item.choices.map((choice, index) => (
                                <View key={index} style={styles.choiceItem}>
                                    <View style={styles.choiceHeader}>
                                        <Text style={styles.choiceEmoji}>{getChoiceEmoji(choice)}</Text>
                                        <Text style={styles.choiceText}>{choice.description}</Text>
                                    </View>

                                    {choice.required_stat && (
                                        <View style={styles.requirementBox}>
                                            <Text style={styles.requirementText}>
                                                Requiert: {choice.required_stat} ≥ {choice.required_value}
                                            </Text>
                                        </View>
                                    )}

                                    <Text style={styles.effectsText}>{renderEffects(choice)}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.noChoicesText}>Aucun choix défini</Text>
                    )}
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleUpdateScenario(item)}>
                        <Text style={styles.buttonText}>Modifier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(item.id)}>
                        <Text style={styles.buttonText}>Supprimer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    if (loading) return (
        <View
            style={styles.container}
            resizeMode="cover"
        >
            <ActivityIndicator size="large" color="rgb(255, 0, 225)" style={styles.loader} />
        </View>
    )

    return (
        <View
            style={styles.container}
            resizeMode="cover"
        >
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
                    renderItem={renderItem}
                    contentContainerStyle={styles.scrollContent}
                />
            )}

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.createButtonText}>Créer un scénario</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Créer un scénario</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
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
                                <View key={idx} style={styles.choiceFormContainer}>
                                    <View style={styles.choiceFormHeader}>
                                        <Text style={styles.choiceFormTitle}>Choix {idx + 1}</Text>
                                        <TouchableOpacity
                                            onPress={() => removeChoice(idx)}
                                            style={styles.removeChoiceButton}
                                        >
                                            <Text style={styles.removeChoiceButtonText}>🗑️</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.formGroup}>
                                        <Text style={styles.formLabel}>Description</Text>
                                        <TextInput
                                            placeholder="Description du choix"
                                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                            value={choice.description}
                                            onChangeText={(text) => {
                                                const updated = [...newScenario.choices]
                                                updated[idx].description = text
                                                setNewScenario({ ...newScenario, choices: updated })
                                            }}
                                            style={styles.formInput}
                                        />
                                    </View>

                                    <View style={styles.formGroup}>
                                        <Text style={styles.formLabel}>Stat requise</Text>
                                        <TextInput
                                            placeholder="Ex: charisma, dexterity"
                                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                            value={choice.required_stat}
                                            onChangeText={(text) => {
                                                const updated = [...newScenario.choices]
                                                updated[idx].required_stat = text
                                                setNewScenario({ ...newScenario, choices: updated })
                                            }}
                                            style={styles.formInput}
                                        />
                                    </View>

                                    <View style={styles.formGroup}>
                                        <Text style={styles.formLabel}>Valeur requise</Text>
                                        <TextInput
                                            placeholder="Valeur minimale requise"
                                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                            keyboardType="numeric"
                                            value={choice.required_value?.toString()}
                                            onChangeText={(text) => {
                                                const updated = [...newScenario.choices]
                                                updated[idx].required_value = text
                                                setNewScenario({ ...newScenario, choices: updated })
                                            }}
                                            style={styles.formInput}
                                        />
                                    </View>

                                    <View style={styles.formGroup}>
                                        <Text style={styles.formLabel}>Résultat affiché</Text>
                                        <TextInput
                                            placeholder="Texte affiché après le choix"
                                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                            value={choice.result}
                                            onChangeText={(text) => {
                                                const updated = [...newScenario.choices]
                                                updated[idx].result = text
                                                setNewScenario({ ...newScenario, choices: updated })
                                            }}
                                            style={styles.formInput}
                                        />
                                    </View>

                                    <Text style={styles.effectsGroupTitle}>Effets sur les statistiques</Text>

                                    <View style={styles.statsGrid}>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statLabel}>❤️ Vie</Text>
                                            <TextInput
                                                placeholder="+/-"
                                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                                keyboardType="numeric"
                                                value={choice.effect_life?.toString()}
                                                onChangeText={(text) => {
                                                    const updated = [...newScenario.choices]
                                                    updated[idx].effect_life = Number(text)
                                                    setNewScenario({ ...newScenario, choices: updated })
                                                }}
                                                style={styles.statInput}
                                            />
                                        </View>

                                        <View style={styles.statItem}>
                                            <Text style={styles.statLabel}>✨ Charisme</Text>
                                            <TextInput
                                                placeholder="+/-"
                                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                                keyboardType="numeric"
                                                value={choice.effect_charisma?.toString()}
                                                onChangeText={(text) => {
                                                    const updated = [...newScenario.choices]
                                                    updated[idx].effect_charisma = Number(text)
                                                    setNewScenario({ ...newScenario, choices: updated })
                                                }}
                                                style={styles.statInput}
                                            />
                                        </View>

                                        <View style={styles.statItem}>
                                            <Text style={styles.statLabel}>🏃 Dextérité</Text>
                                            <TextInput
                                                placeholder="+/-"
                                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                                keyboardType="numeric"
                                                value={choice.effect_dexterity?.toString()}
                                                onChangeText={(text) => {
                                                    const updated = [...newScenario.choices]
                                                    updated[idx].effect_dexterity = Number(text)
                                                    setNewScenario({ ...newScenario, choices: updated })
                                                }}
                                                style={styles.statInput}
                                            />
                                        </View>

                                        <View style={styles.statItem}>
                                            <Text style={styles.statLabel}>🍀 Chance</Text>
                                            <TextInput
                                                placeholder="+/-"
                                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                                keyboardType="numeric"
                                                value={choice.effect_luck?.toString()}
                                                onChangeText={(text) => {
                                                    const updated = [...newScenario.choices]
                                                    updated[idx].effect_luck = Number(text)
                                                    setNewScenario({ ...newScenario, choices: updated })
                                                }}
                                                style={styles.statInput}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.formGroup}>
                                        <View style={styles.checkboxContainer}>
                                            <Text style={styles.formLabel}>Fin de partie</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    const updated = [...newScenario.choices]
                                                    updated[idx].is_game_over = !updated[idx].is_game_over
                                                    setNewScenario({ ...newScenario, choices: updated })
                                                }}
                                                style={[
                                                    styles.checkbox,
                                                    choice.is_game_over && styles.checkboxGameOver
                                                ]}
                                            >
                                                {choice.is_game_over && <Text style={styles.checkboxMark}>✓</Text>}
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.formGroup}>
                                        <Text style={styles.formLabel}>ID du prochain scénario</Text>
                                        <TextInput
                                            placeholder="Laissez vide si fin de partie"
                                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                            keyboardType="numeric"
                                            value={choice.nextScenarioId?.toString()}
                                            onChangeText={(text) => {
                                                const updated = [...newScenario.choices]
                                                updated[idx].nextScenarioId = text ? Number(text) : null
                                                setNewScenario({ ...newScenario, choices: updated })
                                            }}
                                            style={styles.formInput}
                                        />
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={isUpdateModalVisible}
                onRequestClose={() => setUpdateModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Mettre à jour le scénario</Text>
                            <TouchableOpacity
                                onPress={() => setUpdateModalVisible(false)}
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
                                    value={updateScenarioData.title}
                                    onChangeText={(text) => setUpdateScenarioData({ ...updateScenarioData, title: text })}
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
                                    value={updateScenarioData.description}
                                    onChangeText={(text) => setUpdateScenarioData({ ...updateScenarioData, description: text })}
                                    style={[styles.formInput, styles.textArea]}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <View style={styles.checkboxContainer}>
                                    <Text style={styles.formLabel}>Scénario final</Text>
                                    <TouchableOpacity
                                        onPress={() => setUpdateScenarioData({ ...updateScenarioData, is_final: !updateScenarioData.is_final })}
                                        style={[styles.checkbox, updateScenarioData.is_final && styles.checkboxChecked]}
                                    >
                                        {updateScenarioData.is_final && <Text style={styles.checkboxMark}>✓</Text>}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Type</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={updateScenarioData.type}
                                        onValueChange={(itemValue) => setUpdateScenarioData({ ...updateScenarioData, type: itemValue })}
                                        style={styles.picker}
                                        dropdownIconColor="rgb(255, 0, 225)"
                                    >
                                        <Picker.Item label="Sélectionnez un type" value="" />
                                        <Picker.Item label="Destiny" value="destiny" />
                                        <Picker.Item label="Choice" value="choice" />
                                    </Picker>
                                </View>
                            </View>

                            {/* Affichage conditionnel des choix */}
                            {updateScenarioData.type === "choice" && updateScenarioData.choices.map((choice, idx) => (
                                <View key={idx} style={styles.choiceFormContainer}>
                                    <TextInput
                                        placeholder="Description du choix"
                                        value={choice.description}
                                        onChangeText={(text) => {
                                            const updatedChoices = [...updateScenarioData.choices];
                                            updatedChoices[idx].description = text;
                                            setUpdateScenarioData({ ...updateScenarioData, choices: updatedChoices });
                                        }}
                                        style={styles.formInput}
                                    />
                                    {/* Ajoute ici tous les autres champs pour les choix */}
                                </View>
                            ))}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                onPress={() => setUpdateModalVisible(false)}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleUpdateScenarioSave()}
                                style={styles.saveButton}
                            >
                                <Text style={styles.saveButtonText}>Sauvegarder</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View >
    )
}

const styles = StyleSheet.create({
    // Styles de base
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        color: "rgb(255, 0, 225)",
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

    // Cartes de scénarios
    scenarioCard: {
        backgroundColor: "rgba(30, 15, 40, 0.85)",
        padding: 18,
        borderRadius: 15,
        marginBottom: 15,
        borderColor: "rgba(115, 32, 143, 0.32)",
        borderWidth: 1,
        shadowColor: "rgba(194, 152, 187, 0)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },
    cardContent: {
        flex: 1,
    },
    scenarioHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    scenarioInfo: {
        flex: 1,
    },
    scenarioEmoji: {
        fontSize: 40,
        marginRight: 15,
    },
    scenarioName: {
        fontFamily: "Orbitron-Regular",
        fontSize: 20,
        fontWeight: "bold",
        color: "rgb(255, 0, 230)",
        marginBottom: 5,
    },
    metaInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    idText: {
        color: "white",
        fontFamily: "Orbitron-Regular",
        marginRight: 10,
    },
    finalBadge: {
        backgroundColor: "rgba(255, 215, 0, 0.8)",
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    finalBadgeText: {
        color: "rgb(30, 15, 40)",
        fontWeight: "bold",
        fontSize: 12,
        fontFamily: "Orbitron-Bold",
    },

    // Description du scénario
    descriptionContainer: {
        backgroundColor: "rgba(40, 6, 65, 0.4)",
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
    },
    descriptionText: {
        color: "rgb(255, 255, 255)",
        fontFamily: "Orbitron-Regular",
        fontSize: 14,
        lineHeight: 20,
    },

    // Choix disponibles
    choicesContainer: {
        marginTop: 15,
    },
    choicesTitle: {
        color: "rgb(255, 255, 255)",
        fontFamily: "Orbitron-Bold",
        fontSize: 16,
        marginBottom: 10,
    },
    choiceItem: {
        backgroundColor: "rgba(60, 20, 80, 0.3)",
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        borderColor: "rgba(115, 32, 143, 0.2)",
        borderWidth: 1,
    },
    choiceHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    choiceEmoji: {
        fontSize: 18,
        marginRight: 8,
    },
    choiceText: {
        color: "rgb(255, 255, 255)",
        fontFamily: "Orbitron-Regular",
        fontSize: 14,
        flex: 1,
    },
    requirementBox: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 5,
        padding: 5,
        marginVertical: 5,
        alignSelf: "flex-start",
    },
    requirementText: {
        color: "rgb(255, 255, 0)",
        fontFamily: "Orbitron-Regular",
        fontSize: 12,
    },
    effectsText: {
        color: "rgb(183, 45, 230)",
        fontFamily: "Orbitron-Regular",
        fontSize: 12,
        marginTop: 5,
    },
    noChoicesText: {
        color: "rgb(223, 182, 219)",
        fontFamily: "Orbitron-Regular",
        fontStyle: "italic",
        textAlign: "center",
        marginTop: 10,
    },

    // Boutons
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
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    editButton: {
        backgroundColor: "rgba(52, 152, 219, 0.6)",
        padding: 10,
        borderRadius: 10,
        flex: 1,
        marginRight: 5,
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "rgba(191, 26, 109, 0.6)",
        padding: 10,
        borderRadius: 10,
        flex: 1,
        marginLeft: 5,
        alignItems: "center",
    },
    buttonText: {
        fontFamily: "Orbitron-Regular",
        color: "white",
        fontWeight: "bold",
    },
    createButton: {
        backgroundColor: "rgba(52, 8, 69, 0.71)",
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        marginTop: 20,
        shadowColor: "rgba(194, 152, 187, 0)",
        borderColor: "rgba(107, 31, 132, 0.32)",
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

    // Styles pour la modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        padding: 10, // Réduit pour donner plus d'espace à la modal
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
        maxHeight: '95%', // Augmenté pour prendre plus d'espace
        width: '95%', // Augmenté pour être plus large
        alignSelf: 'center', // Centré horizontalement
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(115, 32, 143, 0.5)',
        padding: 20, // Augmenté
    },
    modalTitle: {
        color: "rgb(255, 0, 225)",
        fontSize: 24, // Augmenté
        fontWeight: "bold",
        fontFamily: "Orbitron-Bold",
    },
    closeButton: {
        width: 36, // Augmenté
        height: 36, // Augmenté
        borderRadius: 18,
        backgroundColor: 'rgba(255, 0, 225, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18, // Augmenté
        fontWeight: 'bold',
    },
    modalScrollView: {
        padding: 20, // Augmenté
        maxHeight: '75%', // Augmenté pour permettre plus de contenu visible
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20, // Augmenté
        borderTopWidth: 1,
        borderTopColor: 'rgba(115, 32, 143, 0.5)',
    },

    // Styles pour le formulaire
    formGroup: {
        marginBottom: 20, // Augmenté
    },
    formLabel: {
        color: 'white',
        fontFamily: "Orbitron-Regular",
        fontSize: 16, // Augmenté
        marginBottom: 8, // Augmenté
    },
    formInput: {
        backgroundColor: 'rgba(60, 20, 80, 0.3)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(115, 32, 143, 0.5)',
        color: 'white',
        padding: 15, // Augmenté
        fontFamily: "Orbitron-Regular",
        fontSize: 16, // Augmenté
        minHeight: 50, // Hauteur minimale ajoutée
    },
    textArea: {
        minHeight: 100, // Augmenté
        textAlignVertical: 'top',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10, // Ajouté pour plus d'espace
    },
    checkbox: {
        width: 30, // Augmenté
        height: 30, // Augmenté
        borderWidth: 1,
        borderColor: 'rgba(115, 32, 143, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 6, // Augmenté
    },
    checkboxChecked: {
        backgroundColor: 'rgba(255, 0, 225, 0.7)',
    },
    checkboxGameOver: {
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
    },
    checkboxMark: {
        color: 'white',
        fontSize: 18, // Augmenté
    },
    pickerContainer: {
        backgroundColor: 'rgba(60, 20, 80, 0.3)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(115, 32, 143, 0.5)',
        overflow: 'hidden',
        marginBottom: 10, // Ajouté
    },
    picker: {
        color: 'white',
        height: 60, // Augmenté
        fontSize: 16, // Ajouté pour être cohérent
    },

    // Styles pour les choix
    addChoiceButton: {
        backgroundColor: 'rgba(115, 32, 143, 0.5)',
        padding: 16, // Augmenté
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20, // Augmenté
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
        fontSize: 18, // Augmenté
    },
    choiceFormContainer: {
        backgroundColor: 'rgba(40, 6, 65, 0.4)',
        borderRadius: 10,
        padding: 20, // Augmenté
        marginBottom: 25, // Augmenté
        borderWidth: 1,
        borderColor: 'rgba(115, 32, 143, 0.3)',
    },
    choiceFormHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20, // Augmenté
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(115, 32, 143, 0.3)',
        paddingBottom: 15, // Augmenté
    },
    choiceFormTitle: {
        color: 'rgb(255, 0, 225)',
        fontFamily: "Orbitron-Bold",
        fontSize: 18, // Augmenté
    },
    removeChoiceButton: {
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        width: 36, // Augmenté
        height: 36, // Augmenté
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeChoiceButtonText: {
        fontSize: 18, // Augmenté
    },
    effectsGroupTitle: {
        color: 'rgb(255, 0, 225)',
        fontFamily: "Orbitron-Regular",
        fontSize: 16, // Augmenté
        marginTop: 15, // Augmenté
        marginBottom: 15, // Augmenté
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20, // Augmenté
    },
    statItem: {
        width: '48%',
        marginBottom: 15, // Augmenté
    },
    statLabel: {
        color: 'white',
        fontFamily: "Orbitron-Regular",
        fontSize: 14, // Augmenté
        marginBottom: 8, // Augmenté
    },
    statInput: {
        backgroundColor: 'rgba(60, 20, 80, 0.3)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(115, 32, 143, 0.5)',
        color: 'white',
        padding: 12, // Augmenté
        fontFamily: "Orbitron-Regular",
        fontSize: 16, // Augmenté
        minHeight: 45, // Hauteur minimale ajoutée
    },

    // Boutons de la modal
    cancelButton: {
        backgroundColor: 'rgba(100, 100, 100, 0.6)',
        padding: 15, // Augmenté
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontFamily: "Orbitron-Regular",
        fontWeight: 'bold',
        fontSize: 16, // Augmenté
    },
    saveButton: {
        backgroundColor: 'rgba(0, 200, 100, 0.6)',
        padding: 15, // Augmenté
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontFamily: "Orbitron-Regular",
        fontWeight: 'bold',
        fontSize: 16, // Augmenté
    },
})

export default Admin