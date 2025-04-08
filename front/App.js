import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Accueil from './pages/Accueil';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Connexion" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Connexion" component={Connexion} />
        <Stack.Screen name="Inscription" component={Inscription} />
        <Stack.Screen name="Accueil" component={Accueil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
