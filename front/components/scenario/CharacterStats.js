import { View, Text, StyleSheet } from "react-native"

const CharacterStats = ({ character }) => {
    if (!character) return null

    return (
        <View style={styles.characterStatsContainer}>
            <Text style={styles.characterName}>{character.name}</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statsColumn}>
                    <Text style={styles.statBadge}>❤️ Vie: {character.life}</Text>
                    <Text style={styles.statBadge}>✨ Charisme: {character.charisma}</Text>
                    <Text style={styles.statBadge}>🏃 Dextérité: {character.dexterity}</Text>
                </View>
                <View style={styles.statsColumn}>
                    <Text style={styles.statBadge}>🧠 Intellect: {character.intelligence}</Text>
                    <Text style={styles.statBadge}>🍀 Chance: {character.luck}</Text>
                    <Text style={styles.statBadge}>{character.is_alive ? "✅ En vie" : "☠️ Mort"}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    characterStatsContainer: {
        backgroundColor: "rgba(30, 15, 40, 0.85)",
        padding: 10,
        borderRadius: 15,
        marginBottom: 15,
        borderColor: "rgba(183, 45, 230, 0.4)",
        borderWidth: 1,
        fontFamily: "Orbitron-Regular",
    },
    characterName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(219, 4, 198)",
        marginBottom: 5,
        textAlign: "center",
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    statsColumn: {
        flex: 1,
    },
    statBadge: {
        backgroundColor: "rgba(40, 20, 55, 0.7)",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        color: "white",
        fontSize: 12,
        marginBottom: 5,
        marginHorizontal: 2,
        fontFamily: "Orbitron-Regular",
    },
})

export default CharacterStats
