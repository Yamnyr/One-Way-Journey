import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

const ErrorView = ({ message, onBack }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>{message || "Une erreur est survenue"}</Text>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
        marginTop: 50,
        fontFamily: "Orbitron-Regular",
    },
    backButton: {
        backgroundColor: "rgba(169, 40, 216, 0.65)",
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        marginVertical: 20,
        shadowColor: "rgba(194, 152, 187, 0.71)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    buttonText: {
        fontFamily: "Orbitron-Regular",
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
})

export default ErrorView
