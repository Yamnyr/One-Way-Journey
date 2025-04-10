import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import statsService from "../services/statsService";

const AdminHome = () => {
    const navigation = useNavigation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const statisticsData = await statsService.getStatistics();
            setStats(statisticsData);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des statistiques:", err);
            setError("Impossible de charger les statistiques");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigation.navigate("Accueil");
    };

    const renderStatistics = () => {
        if (loading) {
            return <ActivityIndicator size="large" color="rgb(219, 4, 198)" />;
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchStatistics}>
                        <Text style={styles.retryButtonText}>Réessayer</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (!stats) return null;

        return (
            <View style={styles.statsContainer}>
                <Text style={styles.statsTitle}>Statistiques globales</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.userCount}</Text>
                        <Text style={styles.statLabel}>Utilisateurs</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.characterCount}</Text>
                        <Text style={styles.statLabel}>Personnages</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.scenarioCount}</Text>
                        <Text style={styles.statLabel}>Scénarios</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.choiceCount}</Text>
                        <Text style={styles.statLabel}>Choix</Text>
                    </View>
                    <View style={[styles.statItem, styles.fullWidthStatItem]}>
                        <Text style={styles.statValue}>{stats.endingCount}</Text>
                        <Text style={styles.statLabel}>Fins</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Image source={require("../assets/arrowB.png")} style={styles.backButtonImage} />
            </TouchableOpacity>

            <Text style={styles.title}>Administration</Text>

            {renderStatistics()}

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AdminScenario")}>
                <Text style={styles.buttonText}>Gérer les scénarios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AdminUser")}>
                <Text style={styles.buttonText}>Gérer les utilisateurs</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        color: "rgb(219, 4, 198)",
        fontSize: 34,
        textAlign: "center",
        marginBottom: 20,
        fontFamily: "SixtyfourConvergence",
        textShadowColor: "rgba(175, 132, 168, 0.65)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 17,
        paddingHorizontal: 20,
    },
    statsContainer: {
        backgroundColor: "rgba(30, 15, 40, 0.85)",
        borderRadius: 15,
        padding: 15,
        marginBottom: 30,
        width: "90%",
        borderWidth: 1,
        borderColor: "rgba(183, 45, 230, 0.4)",
    },
    statsTitle: {
        color: "rgb(219, 4, 198)",
        fontSize: 20,
        textAlign: "center",
        fontFamily: "Orbitron-Bold",
        marginBottom: 15,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    statItem: {
        width: "48%",
        backgroundColor: "rgba(218, 9, 218, 0.2)",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    fullWidthStatItem: {
        width: "100%",
    },
    statValue: {
        color: "rgb(255, 255, 255)",
        fontSize: 22,
        fontWeight: "bold",
        fontFamily: "Orbitron-Bold",
    },
    statLabel: {
        color: "rgb(223, 182, 219)",
        fontSize: 12,
        fontFamily: "Orbitron-Medium",
    },
    button: {
        backgroundColor: "rgba(218, 9, 218, 0.65)",
        padding: 15,
        borderRadius: 15,
        width: "90%",
        marginVertical: 10,
        shadowColor: "rgba(194, 152, 187, 0.71)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    buttonText: {
        color: "rgb(223, 182, 219)",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: "Orbitron-Bold",
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
    },
    backButtonImage: {
        opacity: 0.8,
        backgroundColor: "rgba(255, 255, 255, 0)",
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    errorContainer: {
        padding: 15,
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        borderRadius: 10,
        marginBottom: 20,
        alignItems: "center",
    },
    errorText: {
        color: "rgb(255, 100, 100)",
        marginBottom: 10,
        fontFamily: "Orbitron-Medium",
    },
    retryButton: {
        backgroundColor: "rgba(219, 4, 198, 0.5)",
        padding: 8,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "white",
        fontFamily: "Orbitron-Bold",
    },
});

export default AdminHome;