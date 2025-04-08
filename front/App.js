import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { checkUserToken } from './services/Auth';

import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Accueil from './pages/Accueil';
import CharactersPage from './pages/CharacterList';

const Stack = createStackNavigator();

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            const loggedIn = await checkUserToken();
            setIsLoggedIn(loggedIn);
            setIsLoading(false);
        };

        fetchAuthStatus();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1e90ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isLoggedIn ? "Accueil" : "Connexion"} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Connexion" component={Connexion} />
                <Stack.Screen name="characters"  component={CharactersPage} />
                <Stack.Screen name="Inscription" component={Inscription} />
                <Stack.Screen name="Accueil" component={Accueil} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
