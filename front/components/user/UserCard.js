import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

const UserCard = ({ user, onDelete, onUpdate }) => {
    return (
        <View style={styles.userCard}>
            <View style={styles.cardContent}>
                <View style={styles.userHeader}>
                    <Text style={styles.userEmoji}>{user.role === "admin" ? "👑" : "👤"}</Text>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.username || "Nom non disponible"}</Text>
                        <View style={styles.metaInfoContainer}>
                            <Text style={styles.idText}>ID: #{user.id}</Text>
                            {user.role === "admin" && (
                                <View style={styles.adminBadge}>
                                    <Text style={styles.adminBadgeText}>ADMIN</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.emailText}>Email: {user.email || "Non renseigné"}</Text>
                </View>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.editButton} onPress={() => onUpdate(user)}>
                    <Text style={styles.buttonText}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(user.id)}>
                    <Text style={styles.buttonText}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    userCard: {
        backgroundColor: "rgba(30, 15, 40, 0.85)",
        padding: 18,
        borderRadius: 15,
        marginBottom: 15,
        borderColor: "rgba(183, 45, 230, 0.4)",
        borderWidth: 1,
        shadowColor: "rgba(194, 152, 187, 0)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },
    cardContent: {
        flex: 1,
    },
    userHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    userInfo: {
        flex: 1,
    },
    userEmoji: {
        fontSize: 40,
        marginRight: 15,
    },
    userName: {
        fontFamily: "Orbitron-Regular",
        fontSize: 20,
        fontWeight: "bold",
        color: "rgb(219, 4, 198)",
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
    adminBadge: {
        backgroundColor: "rgba(255, 215, 0, 0.8)",
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    adminBadgeText: {
        color: "rgb(30, 15, 40)",
        fontWeight: "bold",
        fontSize: 12,
        fontFamily: "Orbitron-Bold",
    },
    detailsContainer: {
        backgroundColor: "rgba(40, 20, 55, 0.7)",
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
    },
    emailText: {
        color: "rgb(255, 255, 255)",
        fontFamily: "Orbitron-Regular",
        fontSize: 14,
        lineHeight: 20,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    editButton: {
        backgroundColor: "rgba(0, 150, 136, 0.7)",
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

export default UserCard
