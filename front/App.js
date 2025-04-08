"use client"

import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { ActivityIndicator, View, ImageBackground, StyleSheet } from "react-native"
import { checkUserToken } from "./services/Auth"

import Connexion from "./pages/Connexion"
import Inscription from "./pages/Inscription"
import Accueil from "./pages/Accueil"
import CharactersPage from "./pages/CharacterList"
import Admin from "./pages/Admin"
import ScenarioScreen from "./pages/Scenario"

const Stack = createStackNavigator()

// Composant d'arrière-plan global
const BackgroundContainer = ({ children }) => {
    return (
        <ImageBackground source={require("./assets/space.jpg")} style={styles.backgroundImage} resizeMode="cover">
            {children}
        </ImageBackground>
    )
}

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const fetchAuthStatus = async () => {
            const loggedIn = await checkUserToken()
            setIsLoggedIn(loggedIn)
        }

        fetchAuthStatus()
    }, [])

    return (
        <BackgroundContainer>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={isLoggedIn ? "Accueil" : "Connexion"} screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Connexion" component={Connexion} />
                    <Stack.Screen name="characters" component={CharactersPage} />
                    <Stack.Screen name="Admin" component={Admin} />
                    <Stack.Screen name="Inscription" component={Inscription} />
                    <Stack.Screen name="Accueil" component={Accueil} />
                    <Stack.Screen name="Scenario" component={ScenarioScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </BackgroundContainer>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
})
