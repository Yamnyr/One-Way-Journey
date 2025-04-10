import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

const UserCard = ({ user, onDelete, onUpdate }) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.email}>{user.email || "Aucun email"}</Text>
                <Text style={styles.role}>Rôle: {user.role === "admin" ? "Administrateur" : "Joueur"}</Text>
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity style={[styles.actionButton, styles.updateButton]} onPress={() => onUpdate(user)}>
                    <Text style={styles.buttonText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(user.id)}>
                    <Text style={styles.buttonText}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(52, 8, 69, 0.5)",
        borderRadius: 15,
        marginBottom: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: "rgba(107, 31, 132, 0.32)",
        shadowColor: "rgba(194, 152, 187, 0.3)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    cardContent: {
        marginBottom: 10,
    },
    username: {
        fontSize: 18,
        fontWeight: "bold",
        color: "rgb(255, 255, 255)",
        marginBottom: 5,
        fontFamily: "Orbitron-Bold",
    },
    email: {
        fontSize: 14,
        color: "rgb(223, 182, 219)",
        marginBottom: 5,
        fontFamily: "Orbitron-Regular",
    },
    role: {
        fontSize: 14,
        color: "rgb(223, 182, 219)",
        fontFamily: "Orbitron-Regular",
    },
    cardActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginLeft: 10,
    },
    updateButton: {
        backgroundColor: "rgba(0, 150, 136, 0.7)",
    },
    deleteButton: {
        backgroundColor: "rgba(244, 67, 54, 0.7)",
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        fontFamily: "Orbitron-Regular",
    },
})

export default UserCard
