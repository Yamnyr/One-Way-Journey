import { View, Text, StyleSheet } from "react-native"

const ScenarioDescription = ({ title, description }) => {
    return (
        <View style={styles.scenarioHeader}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    scenarioHeader: {
        marginBottom: 20,
    },
    title: {
        fontFamily: "Orbitron-Regular",
        fontSize: 24,
        fontWeight: "bold",
        color: "rgb(219, 4, 198)",
        marginBottom: 15,
        textAlign: "center",
        textShadowColor: "rgba(183, 45, 230, 0.65)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    description: {
        fontFamily: "Orbitron-Regular",
        fontSize: 15,
        color: "white",
        marginBottom: 20,
        lineHeight: 24,
    },
})

export default ScenarioDescription
