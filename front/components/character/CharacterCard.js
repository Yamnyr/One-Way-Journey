import { View, Text, StyleSheet, Pressable } from "react-native"

const CharacterCard = ({ item, onPress, onLongPress, getRaceEmoji }) => {
    // Contenu de carte pour un personnage vivant
    const liveCharacterContent = (
        <View style={styles.cardContent}>
            <View style={styles.characterHeader}>
                <Text style={styles.raceEmoji}>{getRaceEmoji(item.species)}</Text>
                <View style={styles.characterInfo}>
                    <Text style={styles.characterName}>{item.name}</Text>
                    <Text style={styles.characterText}>Espèce : {item.species}</Text>
                </View>
            </View>

            {/* Stats du personnage (seulement pour les vivants) */}
            <View style={styles.statsContainer}>
                <View style={styles.statsColumn}>
                    <Text style={styles.statItem}>❤️ Vie : {item.life || 0}</Text>
                    <Text style={styles.statItem}>✨ Charisme : {item.charisma || 0}</Text>
                    <Text style={styles.statItem}>🏃 Dextérité : {item.dexterity || 0}</Text>
                </View>
                <View style={styles.statsColumn}>
                    <Text style={styles.statItem}>🧠 Intelligence : {item.intelligence || 0}</Text>
                    <Text style={styles.statItem}>🍀 Chance : {item.luck || 0}</Text>
                    <Text style={styles.statItem}>✅ En vie !</Text>
                </View>
            </View>

            {/* Scénario actuel */}
            {item.currentScenarioId && <Text style={styles.scenarioText}>🎮 Scénario actuel : {item.Scenario.title}</Text>}
        </View>
    )

    // Contenu de carte pour un personnage mort
    const deadCharacterContent = (
        <View style={styles.cardContent}>
            <View style={styles.characterHeader}>
                <Text style={styles.raceEmoji}>{getRaceEmoji(item.species)}</Text>
                <View style={styles.characterInfo}>
                    <Text style={[styles.characterName, styles.deadCharacterName]}>{item.name}</Text>
                    <Text style={styles.characterText}>Espèce : {item.species}</Text>
                </View>
            </View>

            {/* Message pour les personnages morts */}
            <View style={styles.deadMessageContainer}>
                <Text style={styles.deadMessage}>☠️ Ce personnage est mort</Text>
                <Text style={styles.deadSubMessage}>Impossible de continuer l'aventure</Text>
            </View>

            {/* Indication pour la suppression */}
            <Text style={styles.deleteHint}>Appui long pour supprimer ce personnage</Text>
        </View>
    )

    return (
        <Pressable
            style={({ pressed }) => [
                styles.characterCard,
                !item.is_alive && styles.deadCharacterCard,
                pressed && item.is_alive && styles.cardPressed,
            ]}
            onPress={() => item.is_alive && onPress(item)}
            onLongPress={() => onLongPress(item.id)}
            delayLongPress={500} // Délai avant que l'appui long soit détecté
            android_ripple={item.is_alive ? { color: "rgba(255, 0, 225, 0.2)" } : null}
        >
            {item.is_alive ? liveCharacterContent : deadCharacterContent}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    // Carte personnage
    characterCard: {
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
    // Style pour l'état pressed
    cardPressed: {
        backgroundColor: "rgba(60, 30, 80, 0.85)",
        borderColor: "rgba(255, 0, 225, 0.5)",
    },
    // Style pour les personnages morts
    deadCharacterCard: {
        backgroundColor: "rgba(7,3,9,0.85)",
        borderColor: "rgba(115, 32, 143, 0.32)",
        opacity: 0.8,
    },
    deadCharacterName: {
        color: "rgba(170, 0, 0, 0.8)",
        textDecorationLine: "line-through",
    },
    deadMessageContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        marginVertical: 5,
        backgroundColor: "rgba(30, 15, 40, 0.85)",
        borderRadius: 10,
    },
    deadMessage: {
        fontSize: 18,
        color: "rgba(170, 0, 0, 0.8)",
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Orbitron-Bold",
    },
    deadSubMessage: {
        fontSize: 14,
        color: "rgba(200, 200, 200, 0.8)",
        marginTop: 5,
        textAlign: "center",
        fontFamily: "Orbitron-Regular",
    },
    deleteHint: {
        fontSize: 13,
        color: "rgba(170, 0, 0, 0.8)",
        fontStyle: "italic",
        textAlign: "center",
        marginTop: 10,
        fontFamily: "Orbitron-Regular",
    },
    characterName: {
        fontFamily: "Orbitron-Regular",
        fontSize: 20,
        fontWeight: "bold",
        color: "rgb(255, 0, 230)",
        marginBottom: 8,
    },
    characterText: {
        color: "white",
        marginBottom: 10,
        fontFamily: "Orbitron-Regular",
    },
    // Stats du personnage
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
        backgroundColor: "rgba(40, 6, 65, 0)",
        borderRadius: 8,
        padding: 10,
    },
    statsColumn: {
        flex: 1,
    },
    statItem: {
        color: "rgb(255, 255, 255)",
        marginVertical: 3,
        fontFamily: "Orbitron-Regular",
        fontSize: 12,
    },
    scenarioText: {
        color: "rgb(255, 0, 230)",
        marginVertical: 5,
        fontWeight: "bold",
        fontFamily: "Orbitron-Regular",
    },
    cardContent: {
        flex: 1,
    },
    characterHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    characterInfo: {
        flex: 1,
    },
    raceEmoji: {
        fontSize: 40,
        marginRight: 15,
    },
})

export default CharacterCard
