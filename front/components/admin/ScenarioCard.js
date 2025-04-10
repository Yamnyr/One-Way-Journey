import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'

const ScenarioCard = ({ scenario, onDelete, onUpdate }) => {
    // Fonction pour afficher les effets d'un choix
    const renderEffects = (choice) => {
        const effects = []

        if (choice.effect_life) effects.push(`❤️ Vie: ${choice.effect_life > 0 ? '+' : ''}${choice.effect_life}`)
        if (choice.effect_charisma) effects.push(`✨ Charisme: ${choice.effect_charisma > 0 ? '+' : ''}${choice.effect_charisma}`)
        if (choice.effect_dexterity) effects.push(`🏃 Dextérité: ${choice.effect_dexterity > 0 ? '+' : ''}${choice.effect_dexterity}`)
        if (choice.effect_intelligence) effects.push(`🧠 Intelligence: ${choice.effect_intelligence > 0 ? '+' : ''}${choice.effect_intelligence}`)
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

    return (
        <View style={styles.scenarioCard}>
            <View style={styles.cardContent}>
                <View style={styles.scenarioHeader}>
                    <Text style={styles.scenarioEmoji}>{scenario.type === "choix" ? "⚔️" : "🎮"}</Text>
                    <View style={styles.scenarioInfo}>
                        <Text style={styles.scenarioName}>{scenario.title || "Titre non disponible"}</Text>
                        <View style={styles.metaInfoContainer}>
                            <Text style={styles.idText}>ID: #{scenario.id}</Text>
                            {scenario.is_final && (
                                <View style={styles.finalBadge}>
                                    <Text style={styles.finalBadgeText}>FINAL</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{scenario.description}</Text>
                </View>

                {/* Affichage des choix avec leurs détails */}
                {scenario.choices && scenario.choices.length > 0 ? (
                    <View style={styles.choicesContainer}>
                        <Text style={styles.choicesTitle}>Choix disponibles:</Text>
                        {scenario.choices.map((choice, index) => (
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
                    onPress={() => onUpdate(scenario)}>
                    <Text style={styles.buttonText}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(scenario.id)}>
                    <Text style={styles.buttonText}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        color: 'rgb(219, 4, 198)',
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
})

export default ScenarioCard