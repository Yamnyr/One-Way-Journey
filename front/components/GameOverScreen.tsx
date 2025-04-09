import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native"

interface GameOverScreenProps {
    message: string
    onReturn: () => void
}

const GameOverScreen = ({ message, onReturn }: GameOverScreenProps) => {
    return (
        <ImageBackground source={require("../assets/space.jpg")} style={styles.container} resizeMode="cover">
            <View style={styles.content}>
                <Text style={styles.gameOverTitle}>GAME OVER</Text>
                <Text style={styles.message}>{message}</Text>

                <TouchableOpacity style={styles.returnButton} onPress={onReturn}>
                    <Text style={styles.buttonText}>Retour aux personnages</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        backgroundColor: "rgba(30, 15, 40, 0.85)",
        padding: 30,
        borderRadius: 20,
        width: "85%",
        alignItems: "center",
        borderColor: "rgba(183, 45, 230, 0.6)",
        borderWidth: 1,
    },
    gameOverTitle: {
        fontSize: 36,
        fontWeight: "bold",
        color: "rgb(255, 0, 0)",
        marginBottom: 20,
        textAlign: "center",
        fontFamily: "Orbitron-Bold",
        textShadowColor: "rgba(255, 0, 0, 0.5)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    message: {
        fontSize: 18,
        color: "white",
        marginBottom: 30,
        textAlign: "center",
        lineHeight: 26,
        fontFamily: "Orbitron-Regular",
    },
    returnButton: {
        backgroundColor: "rgba(191, 26, 109, 0.6)",
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
        width: "100%",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: "Orbitron-Regular",
    },
})

export default GameOverScreen
