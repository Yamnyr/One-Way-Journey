import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LogBox } from "react-native";
import { Audio } from 'expo-av';

import { checkUserToken } from "./services/Auth";

import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Accueil from "./pages/Accueil";
import CharactersPage from "./pages/CharacterList";
import Admin from "./pages/Admin";
import UserAdmin from "./pages/UserAdmin";
import ScenarioScreen from "./pages/Scenario";
import { MusicProvider } from "./contexts/MusicContext";
import SpaceBackground from "./components/SpaceBackground";


// Ignore warning
LogBox.ignoreLogs(['Cannot update a component']);

const Stack = createStackNavigator();

const MyCustomTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent',
    },
};

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const soundRef = useRef(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            const loggedIn = await checkUserToken();
            setIsLoggedIn(loggedIn);
        };

        const playMusic = async () => {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    require('./assets/music.mp3'),
                    { isLooping: true }
                );
                soundRef.current = sound;
                await sound.playAsync();
            } catch (e) {
                console.error("Erreur lecture audio :", e);
            }
        };

        fetchAuthStatus();
        // playMusic();

        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    return (
        <MusicProvider>
            <NavigationContainer theme={MyCustomTheme}>
                <SpaceBackground>
                    <Stack.Navigator initialRouteName={isLoggedIn ? "Accueil" : "Connexion"} screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Connexion" component={Connexion} />
                        <Stack.Screen name="characters" component={CharactersPage} />
                        <Stack.Screen name="AdminScenario" component={Admin} />
                        <Stack.Screen name="AdminUser" component={UserAdmin} />
                        <Stack.Screen name="Inscription" component={Inscription} />
                        <Stack.Screen name="Accueil" component={Accueil} />
                        <Stack.Screen name="Scenario" component={ScenarioScreen} />
                    </Stack.Navigator>
                </SpaceBackground>
            </NavigationContainer>
        </MusicProvider>
    );
}
