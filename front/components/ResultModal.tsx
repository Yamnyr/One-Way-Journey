import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native"

interface StatChange {
    stat: string
    value: number
    icon: string
}

interface ResultModalProps {
    visible: boolean
    result: string
    statChanges: StatChange[]
    isGameOver: boolean
    onContinue: () => void
}

const ResultModal = ({ visible, result, statChanges, isGameOver, onContinue }: ResultModalProps) => {
    // Map stat names to readable format
    const getStatName = (stat: string) => {
        const statMap: Record<string, string> = {
            life: "Vie",
            charisma: "Charisme",
            dexterity: "Dextérité",
            intelligence: "Intelligence",
            luck: "Chance",
        }
        return statMap[stat] || stat
    }

    // Get icon for stat
    const getStatIcon = (stat: string) => {
        const iconMap: Record<string, string> = {
            life: "❤️",
            charisma: "✨",
            dexterity: "🏃",
            intelligence: "🧠",
            luck: "🍀",
        }
        return iconMap[stat] || "📊"
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {isGameOver ? (
                        <Text style={styles.gameOverTitle}>GAME OVER</Text>
                    ) : (
                        <Text style={styles.resultTitle}>Résultat</Text>
                    )}

                    <Text style={styles.resultText}>{result}</Text>

                    {statChanges.length > 0 && (
                        <View style={styles.statsContainer}>
                            <Text style={styles.statsTitle}>Conséquences:</Text>
                            {statChanges.map((change, index) => (
                                <View key={index} style={styles.statRow}>
                                    <Text style={styles.statIcon}>{change.icon}</Text>
                                    <Text style={styles.statName}>{getStatName(change.stat)}:</Text>
                                    <Text
                                        style={[
                                            styles.statValue,
                                            change.value > 0
                                                ? styles.statPositive
                                                : change.value < 0
                                                    ? styles.statNegative
                                                    : styles.statNeutral,
                                        ]}
                                    >
                                        {change.value > 0 ? `+${change.value}` : change.value}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <TouchableOpacity style={[styles.continueButton, isGameOver && styles.gameOverButton]} onPress={onContinue}>
                        <Text style={styles.buttonText}>{isGameOver ? "Retour aux personnages" : "Continuer"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        backgroundColor: "rgba(30, 15, 40, 0.95)",
        padding: 25,
        borderRadius: 20,
        width: "85%",
        borderColor: "rgba(183, 45, 230, 0.6)",
        borderWidth: 1,
        alignItems: "center",
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "rgb(223, 182, 219)",
        marginBottom: 20,
        textAlign: "center",
        fontFamily: "Orbitron-Bold",
    },
    gameOverTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "rgb(255, 0, 0)",
        marginBottom: 20,
        textAlign: "center",
        fontFamily: "Orbitron-Bold",
        textShadowColor: "rgba(255, 0, 0, 0.5)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    resultText: {
        fontSize: 18,
        color: "white",
        marginBottom: 20,
        textAlign: "center",
        lineHeight: 24,
        fontFamily: "Orbitron-Regular",
    },
    statsContainer: {
        width: "100%",
        backgroundColor: "rgba(40, 20, 55, 0.7)",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(223, 182, 219)",
        marginBottom: 10,
        fontFamily: "Orbitron-Regular",
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    statIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    statName: {
        color: "white",
        fontSize: 16,
        flex: 1,
        fontFamily: "Orbitron-Regular",
    },
    statValue: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Orbitron-Regular",
    },
    statPositive: {
        color: "rgb(0, 255, 0)",
    },
    statNegative: {
        color: "rgb(255, 50, 50)",
    },
    statNeutral: {
        color: "white",
    },
    continueButton: {
        backgroundColor: "rgba(169, 40, 216, 0.65)",
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        width: "100%",
    },
    gameOverButton: {
        backgroundColor: "rgba(191, 26, 109, 0.6)",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: "Orbitron-Regular",
    },
})

export default ResultModal
