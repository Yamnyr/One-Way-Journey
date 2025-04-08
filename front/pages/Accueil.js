import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';

const fetchFonts = async () => {
  await Font.loadAsync({
    'Orbitron-Regular': require('../assets/fonts/Orbitron-Regular.ttf'),
    'Orbitron-Medium': require('../assets/fonts/Orbitron-Medium.ttf'),
    'Orbitron-Bold': require('../assets/fonts/Orbitron-Bold.ttf'),
    'SixtyfourConvergence': require('../assets/fonts/SixtyfourConvergence.ttf'),
    'BrunoAce-Regular': require('../assets/fonts/BrunoAce-Regular.ttf'),
  });
};

const Accueil = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await fetchFonts();
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    // Affiche un indicateur de chargement pendant que les polices sont chargées
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/space.jpg')} // Remplace avec le chemin de ton image
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.title}>Bienvenue dans l'Aventure Galactique</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Connexion')}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Inscription')}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default Accueil;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: 'rgb(183, 45, 230)',
    fontSize: 27,
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'SixtyfourConvergence',
    textShadowColor: 'rgba(255, 147, 239, 0.65)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 17,
    paddingHorizontal: 20, // Ajoute de l'espace latéral
    flexWrap: 'wrap', // Permet au texte de passer à la ligne si nécessaire
  },
  
  button: {
    backgroundColor: 'rgba(169, 40, 216, 0.65)',
    padding: 15,
    borderRadius: 15,
    width: '80%',
    marginVertical: 10,
    shadowColor: 'rgba(194, 152, 187, 0.71)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  buttonText: {
    color: 'rgb(223, 182, 219)',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
  },
});
