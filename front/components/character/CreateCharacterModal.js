"use client"
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Platform } from "react-native"
import { Picker } from "@react-native-picker/picker"

const CreateCharacterModal = ({ visible, onClose, onCreate, character, setCharacter, speciesList }) => {
    // Rendu du sélecteur d'espèce en fonction de la plateforme
    const renderSpeciesSelector = () => {
        if (Platform.OS === "ios") {
            // Utiliser le Picker sur iOS
            return (
                <Picker
                    selectedValue={character.species}
                    onValueChange={(itemValue) => setCharacter({ ...character, species: itemValue })}
                    style={styles.picker}
                    itemStyle={{ color: "white", fontFamily: "Orbitron-Regular" }}
                >
                    {speciesList.map((species) => (
                        <Picker.Item key={species.value} label={`${species.label} ${species.emoji}`} value={species.value} />
                    ))}
                </Picker>
            )
        } else {
            // Interface alternative pour Android et autres plateformes
            return (
                <ScrollView style={styles.speciesScrollView}>
                    <View style={styles.speciesGrid}>
                        {speciesList.map((species) => (
                            <TouchableOpacity
                                key={species.value}
                                style={[styles.speciesButton, character.species === species.value && styles.speciesButtonSelected]}
                                onPress={() => setCharacter({ ...character, species: species.value })}
                            >
                                <Text style={styles.speciesEmoji}>{species.emoji}</Text>
                                <Text style={[styles.speciesLabel, character.species === species.value && styles.speciesLabelSelected]}>
                                    {species.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )
        }
    }

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Créer un nouveau personnage</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nom du personnage"
                        placeholderTextColor="rgba(255, 255, 255, 0.73)"
                        value={character.name}
                        onChangeText={(text) => setCharacter({ ...character, name: text })}
                    />
                    <Text style={styles.label}>Espèce :</Text>

                    {/* Sélecteur d'espèce conditionnel */}
                    {renderSpeciesSelector()}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={onCreate}>
                            <Text style={styles.buttonText}>Créer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    // Modal
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        backgroundColor: "rgba(30, 15, 40, 0.85)",
        padding: 25,
        borderRadius: 20,
        width: "85%",
        borderColor: "rgba(183, 45, 230, 0.4)",
        borderWidth: 1,
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "rgb(255, 255, 255)",
        fontFamily: "Orbitron-Bold",
    },
    // Formulaire
    label: {
        fontFamily: "Orbitron-Regular",
        fontSize: 16,
        marginBottom: 8,
        color: "rgb(255, 255, 255)",
    },
    input: {
        fontFamily: "Orbitron-Regular",
        borderWidth: 1,
        borderColor: "rgba(183, 45, 230, 0.4)",
        backgroundColor: "rgba(86, 23, 112, 0.76)",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        color: "rgb(255, 255, 255)",
    },
    picker: {
        fontFamily: "Orbitron-Regular",
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: "rgba(183, 45, 230, 0.4)",
        backgroundColor: "rgba(86, 23, 112, 0.76)",
        marginBottom: 20,
        color: "rgb(255, 255, 255)",
    },
    // Layout boutons
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    cancelButton: {
        backgroundColor: "rgba(80, 80, 80, 0.8)",
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: "center",
        fontFamily: "Orbitron-Regular",
    },
    confirmButton: {
        backgroundColor: "rgba(169, 40, 216, 0.65)",
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
        alignItems: "center",
        fontFamily: "Orbitron-Regular",
    },
    buttonText: {
        fontFamily: "Orbitron-Regular",
        color: "white",
        fontWeight: "bold",
    },
    // Styles pour le sélecteur d'espèce alternatif (Android)
    speciesScrollView: {
        maxHeight: 200,
        marginBottom: 15,
    },
    speciesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    speciesButton: {
        width: "48%",
        backgroundColor: "rgba(60, 20, 80, 0.6)",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(183, 45, 230, 0.4)",
    },
    speciesButtonSelected: {
        backgroundColor: "rgba(169, 40, 216, 0.65)",
        borderColor: "rgba(183, 45, 230, 0.4)",
    },
    speciesEmoji: {
        fontSize: 30,
        marginBottom: 5,
    },
    speciesLabel: {
        color: "white",
        fontFamily: "Orbitron-Regular",
        fontSize: 14,
        textAlign: "center",
    },
    speciesLabelSelected: {
        fontWeight: "bold",
    },
})

export default CreateCharacterModal
