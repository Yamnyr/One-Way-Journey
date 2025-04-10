import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

const ChoicesList = ({ choices, onChoiceSelect, checkStatRequirement }) => {
    if (!choices || choices.length === 0) return null

    return (
        <View style={styles.choicesContainer}>
            <Text style={styles.choicesTitle}>Que veux-tu faire ?</Text>

            {choices.map((choice) => {
                const isStatSufficient = checkStatRequirement(choice)

                return (
                    <TouchableOpacity
                        key={choice.id}
                        style={[styles.choiceButton, !isStatSufficient && styles.disabledChoiceButton]}
                        onPress={() => onChoiceSelect(choice)}
                        disabled={!isStatSufficient}
                    >
                        <Text style={[styles.choiceText, !isStatSufficient && styles.disabledChoiceText]}>
                            {choice.description}
                        </Text>
                        {choice.required_stat && choice.required_value && (
                            <Text style={[styles.requirementText, !isStatSufficient && styles.failedRequirementText]}>
                                Requiert: {choice.required_stat} {choice.required_value}+
                            </Text>
                        )}
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    choicesContainer: {
        marginTop: 20,
    },
    choicesTitle: {
        fontFamily: "Orbitron-Regular",
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(219, 4, 198)",
        marginBottom: 15,
    },
    choiceButton: {
        backgroundColor: "rgba(40, 20, 55, 0.7)",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderColor: "rgba(183, 45, 230, 0.3)",
        borderWidth: 1,
    },
    disabledChoiceButton: {
        backgroundColor: "rgba(40, 20, 55, 0.4)",
        borderColor: "rgba(183, 45, 230, 0.1)",
    },
    choiceText: {
        fontFamily: "Orbitron-Regular",
        color: "white",
        fontSize: 16,
    },
    disabledChoiceText: {
        fontFamily: "Orbitron-Regular",
        color: "rgba(255, 255, 255, 0.5)",
    },
    requirementText: {
        fontFamily: "Orbitron-Regular",
        color: "rgba(223, 182, 219, 0.7)",
        fontSize: 14,
        marginTop: 5,
        fontStyle: "italic",
    },
    failedRequirementText: {
        color: "rgba(255, 100, 100, 0.7)",
    },
})

export default ChoicesList
