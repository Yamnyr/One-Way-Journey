import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'

const ChoiceForm = ({ index, choice, onUpdate, onRemove, disabled = false }) => {
    const updateChoiceField = (field, value) => {
        onUpdate({
            ...choice,
            [field]: value
        })
    }

    // Fonction pour gérer les entrées numériques
    const handleNumericInput = (field, text) => {
        // Accepte uniquement les chiffres et un champ vide
        if (text === '' || /^\d+$/.test(text)) {
            const value = text === '' ? 0 : Number(text)

            // Préserve le signe (négatif ou positif)
            const isNegative = choice[field] < 0
            updateChoiceField(field, isNegative ? -value : value)
        }
    }

    // Fonction pour basculer entre valeur positive et négative
    const toggleNegative = (field) => {
        const currentValue = choice[field] || 0
        updateChoiceField(field, -currentValue)
    }

    // Fonction pour obtenir la valeur absolue (pour l'affichage)
    const getAbsValue = (value) => {
        return value ? Math.abs(value).toString() : '0'
    }

    // Fonction pour vérifier si une valeur est négative
    const isNegative = (value) => {
        return value < 0
    }

    return (
        <View style={styles.choiceFormContainer}>
            <View style={styles.choiceFormHeader}>
                <Text style={styles.choiceFormTitle}>Choix {index + 1}</Text>
                <TouchableOpacity
                    onPress={onRemove}
                    style={styles.removeChoiceButton}
                    disabled={disabled}
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
                    onChangeText={(text) => updateChoiceField('description', text)}
                    style={styles.formInput}
                    editable={!disabled}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Stat requise</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={choice.required_stat}
                        onValueChange={(itemValue) => updateChoiceField('required_stat', itemValue)}
                        style={styles.picker}
                        dropdownIconColor="rgba(255, 255, 255, 0.8)"
                        enabled={!disabled}
                    >
                        <Picker.Item label="Aucune" value="" />
                        <Picker.Item label="Charisma" value="charisma" />
                        <Picker.Item label="Dexterity" value="dexterity" />
                        <Picker.Item label="Intelligence" value="intelligence" />
                        <Picker.Item label="Luck" value="luck" />
                    </Picker>
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Valeur requise</Text>
                <TextInput
                    placeholder="Valeur minimale requise"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="numeric"
                    value={choice.required_value?.toString()}
                    onChangeText={(text) => updateChoiceField('required_value', text)}
                    style={styles.formInput}
                    editable={!disabled}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Résultat affiché</Text>
                <TextInput
                    placeholder="Texte affiché après le choix"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={choice.result}
                    onChangeText={(text) => updateChoiceField('result', text)}
                    style={styles.formInput}
                    editable={!disabled}
                />
            </View>

            <Text style={styles.effectsGroupTitle}>Effets sur les statistiques</Text>

            <View style={styles.statsGrid}>
                {/* Vie */}
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>❤️ Vie</Text>
                    <View style={styles.statInputRow}>
                        <View style={styles.negativeCheckContainer}>
                            <TouchableOpacity
                                onPress={() => !disabled && toggleNegative('effect_life')}
                                style={[
                                    styles.negativeCheck,
                                    isNegative(choice.effect_life) && styles.negativeCheckActive
                                ]}
                                disabled={disabled}
                            >
                                {isNegative(choice.effect_life) && <Text style={styles.checkboxMark}>-</Text>}
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            placeholder="0"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            keyboardType="numeric"
                            value={getAbsValue(choice.effect_life)}
                            onChangeText={(text) => handleNumericInput('effect_life', text)}
                            style={styles.statInput}
                            editable={!disabled}
                        />
                    </View>
                </View>

                {/* Charisme */}
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>✨ Charisme</Text>
                    <View style={styles.statInputRow}>
                        <View style={styles.negativeCheckContainer}>
                            <TouchableOpacity
                                onPress={() => !disabled && toggleNegative('effect_charisma')}
                                style={[
                                    styles.negativeCheck,
                                    isNegative(choice.effect_charisma) && styles.negativeCheckActive
                                ]}
                                disabled={disabled}
                            >
                                {isNegative(choice.effect_charisma) && <Text style={styles.checkboxMark}>-</Text>}
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            placeholder="0"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            keyboardType="numeric"
                            value={getAbsValue(choice.effect_charisma)}
                            onChangeText={(text) => handleNumericInput('effect_charisma', text)}
                            style={styles.statInput}
                            editable={!disabled}
                        />
                    </View>
                </View>

                {/* Dextérité */}
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>🏃 Dextérité</Text>
                    <View style={styles.statInputRow}>
                        <View style={styles.negativeCheckContainer}>
                            <TouchableOpacity
                                onPress={() => !disabled && toggleNegative('effect_dexterity')}
                                style={[
                                    styles.negativeCheck,
                                    isNegative(choice.effect_dexterity) && styles.negativeCheckActive
                                ]}
                                disabled={disabled}
                            >
                                {isNegative(choice.effect_dexterity) && <Text style={styles.checkboxMark}>-</Text>}
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            placeholder="0"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            keyboardType="numeric"
                            value={getAbsValue(choice.effect_dexterity)}
                            onChangeText={(text) => handleNumericInput('effect_dexterity', text)}
                            style={styles.statInput}
                            editable={!disabled}
                        />
                    </View>
                </View>

                {/* Intelligence - NOUVEAU */}
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>🧠 Intelligence</Text>
                    <View style={styles.statInputRow}>
                        <View style={styles.negativeCheckContainer}>
                            <TouchableOpacity
                                onPress={() => !disabled && toggleNegative('effect_intelligence')}
                                style={[
                                    styles.negativeCheck,
                                    isNegative(choice.effect_intelligence) && styles.negativeCheckActive
                                ]}
                                disabled={disabled}
                            >
                                {isNegative(choice.effect_intelligence) && <Text style={styles.checkboxMark}>-</Text>}
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            placeholder="0"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            keyboardType="numeric"
                            value={getAbsValue(choice.effect_intelligence)}
                            onChangeText={(text) => handleNumericInput('effect_intelligence', text)}
                            style={styles.statInput}
                            editable={!disabled}
                        />
                    </View>
                </View>

                {/* Chance */}
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>🍀 Chance</Text>
                    <View style={styles.statInputRow}>
                        <View style={styles.negativeCheckContainer}>
                            <TouchableOpacity
                                onPress={() => !disabled && toggleNegative('effect_luck')}
                                style={[
                                    styles.negativeCheck,
                                    isNegative(choice.effect_luck) && styles.negativeCheckActive
                                ]}
                                disabled={disabled}
                            >
                                {isNegative(choice.effect_luck) && <Text style={styles.checkboxMark}>-</Text>}
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            placeholder="0"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            keyboardType="numeric"
                            value={getAbsValue(choice.effect_luck)}
                            onChangeText={(text) => handleNumericInput('effect_luck', text)}
                            style={styles.statInput}
                            editable={!disabled}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.formGroup}>
                <View style={styles.checkboxContainer}>
                    <Text style={styles.formLabel}>Fin de partie</Text>
                    <TouchableOpacity
                        onPress={() => !disabled && updateChoiceField('is_game_over', !choice.is_game_over)}
                        style={[
                            styles.checkbox,
                            choice.is_game_over && styles.checkboxGameOver
                        ]}
                        disabled={disabled}
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
                    onChangeText={(text) => updateChoiceField('nextScenarioId', text ? Number(text) : null)}
                    style={styles.formInput}
                    editable={!disabled}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    choiceFormContainer: {
        backgroundColor: 'rgba(40, 6, 65, 0.4)',
        borderRadius: 10,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(115, 32, 143, 0.3)',
    },
    choiceFormHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(115, 32, 143, 0.3)',
        paddingBottom: 15,
    },
    choiceFormTitle: {
        color: 'rgb(255, 0, 225)',
        fontFamily: "Orbitron-Bold",
        fontSize: 18,
    },
    removeChoiceButton: {
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeChoiceButtonText: {
        fontSize: 18,
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
    effectsGroupTitle: {
        color: 'rgb(255, 0, 225)',
        fontFamily: "Orbitron-Regular",
        fontSize: 16,
        marginTop: 15,
        marginBottom: 15,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statItem: {
        width: '48%',
        marginBottom: 15,
    },
    statLabel: {
        color: 'white',
        fontFamily: "Orbitron-Regular",
        fontSize: 14,
        marginBottom: 8,
    },
    statInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    negativeCheckContainer: {
        marginRight: 8,
    },
    negativeCheck: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: 'rgba(115, 32, 143, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 6,
    },
    negativeCheckActive: {
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
    },
    statInput: {
        backgroundColor: 'rgba(60, 20, 80, 0.3)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(115, 32, 143, 0.5)',
        color: 'white',
        padding: 12,
        fontFamily: "Orbitron-Regular",
        fontSize: 16,
        minHeight: 45,
        flex: 1,
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
    checkboxGameOver: {
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
    },
    checkboxMark: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
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
})

export default ChoiceForm