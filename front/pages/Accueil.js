"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { jwtDecode } from "jwt-decode"
import * as Font from "expo-font"
import { logoutUser } from "../services/Auth"
import { useMusic } from "../contexts/MusicContext"

const fetchFonts = async () => {
    await Font.loadAsync({
        "Orbitron-Regular": require("../assets/fonts/Orbitron-Regular.ttf"),
        "Orbitron-Medium": require("../assets/fonts/Orbitron-Medium.ttf"),
        "Orbitron-Bold": require("../assets/fonts/Orbitron-Bold.ttf"),
        SixtyfourConvergence: require("../assets/fonts/SixtyfourConvergence.ttf"),
        "BrunoAce-Regular": require("../assets/fonts/BrunoAce-Regular.ttf"),
    })
}

const Accueil = ({ navigation }) => {
    const [fontsLoaded, setFontsLoaded] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const { isMusicPlaying, toggleMusic } = useMusic()

    useEffect(() => {
        const checkRole = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken")
                if (token) {
                    const decoded = jwtDecode(token)
                    console.log(decoded)
                    if (decoded.role === "admin") {
                        setIsAdmin(true)
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la vérification du rôle :", error)
            }
        }

        const loadFonts = async () => {
            await fetchFonts()
            setFontsLoaded(true)
        }

        loadFonts()
        checkRole()
    }, [])

    const handleLogout = async () => {
        await logoutUser()
        navigation.navigate("Connexion")
    }

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        )
    }

    return (
        <View style={styles.container} resizeMode="cover">
            {/* Bouton Logout en haut à droite */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Image source={require("../assets/logout.png")} style={styles.logoutImage} />
            </TouchableOpacity>

            <Text style={styles.title}>One Way Journey</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("characters")}>
                <Text style={styles.buttonText}>Jouer</Text>
            </TouchableOpacity>

            {isAdmin && (
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AdminHome")}>
                    <Text style={styles.buttonText}>Admin</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={toggleMusic} style={styles.musicButton}>
                <Text style={styles.buttonText}>{isMusicPlaying ? "🔊 Couper le son" : "🔈 Remettre le son"}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Accueil

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
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
        marginBottom: 40,
        fontFamily: "SixtyfourConvergence",
        textShadowColor: "rgba(175, 132, 168, 0.65)",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 17,
        paddingHorizontal: 20,
        flexWrap: "wrap",
    },
    button: {
        backgroundColor: "rgba(218, 9, 218, 0.65)",
        padding: 15,
        borderRadius: 15,
        width: "80%",
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
    logoutButton: {
        position: "absolute",
        top: 20,
        left: 15,
        backgroundColor: "rgba(151, 28, 172, 0)",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        shadowColor: "rgba(202, 14, 187, 0.46)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    logoutImage: {
        opacity: 0.8,
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    musicButton: {
        position: "absolute",
        bottom: 30,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
        borderRadius: 10,
    },
})
