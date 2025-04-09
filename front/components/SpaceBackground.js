import React, { useMemo, useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Composant d'étoile simplifié sans animation
const Star = ({ size, top, left, color = "#ffffff" }) => {
    return (
        <View
            style={[
                styles.star,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    top,
                    left,
                    backgroundColor: color
                }
            ]}
        />
    );
};

// Nouveau composant d'étoile filante
const ShootingStar = ({ startX, startY, speed, angle, size, duration }) => {
    const translateX = useMemo(() => new Animated.Value(0), []);
    const translateY = useMemo(() => new Animated.Value(0), []);
    const opacity = useMemo(() => new Animated.Value(0), []);

    // Calculer la distance parcourue basée sur l'angle
    const distance = 150 + Math.random() * 200;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;

    useEffect(() => {
        // Animation de déplacement et d'opacité
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: endX,
                duration: duration,
                useNativeDriver: true
            }),
            Animated.timing(translateY, {
                toValue: endY,
                duration: duration,
                useNativeDriver: true
            }),
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: duration * 0.2,
                    useNativeDriver: true
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: duration * 0.8,
                    useNativeDriver: true
                })
            ])
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.shootingStar,
                {
                    width: size * 5,
                    height: size,
                    top: startY,
                    left: startX,
                    transform: [
                        { translateX },
                        { translateY },
                        { rotate: `${angle}rad` }
                    ],
                    opacity
                }
            ]}
        />
    );
};

// Composant de nébuleuse statique
const Nebula = ({ style, colors }) => {
    return (
        <View style={style}>
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nebulaGradient}
            />
        </View>
    );
};

// Planète simple sans animation
const Planet = ({ size, top, left }) => {
    // Choisir aléatoirement entre couleur bleu ou rouge
    const planetColor = Math.random() > 0.5 ?
        "rgba(124, 180, 255, 0.9)" : // Bleu pour les planètes gazeuses
        "rgba(165, 113, 100, 0.9)";  // Rougeâtre pour les planètes rocheuses

    return (
        <View style={{ position: 'absolute', top, left }}>
            {/* La planète */}
            <View style={[styles.planet, { width: size, height: size, backgroundColor: planetColor }]}>
                {/* Surface détaillée */}
                <View style={[styles.planetSurface, { opacity: 0.4 }]} />
            </View>
        </View>
    );
};

// Générateur d'étoiles simplifié
const generateStars = (count, dimensions) => {
    const { width, height } = dimensions;
    const stars = [];

    // Réduire le nombre total d'étoiles
    const actualCount = Math.floor(count * 0.4); // 40% du nombre original

    for (let i = 0; i < actualCount; i++) {
        // Distribution simplifiée des tailles
        const size = 0.5 + Math.random() * 2;

        stars.push({
            id: i,
            size: size,
            top: Math.random() * height,
            left: Math.random() * width,
            color: Math.random() > 0.3 ? "#ffffff" : "#B7E5FF"
        });
    }

    return stars;
};

// Générateur de planètes - réduit le nombre
const generatePlanets = (count, dimensions) => {
    const { width, height } = dimensions;
    const planets = [];

    // Réduire le nombre de planètes à 1 ou 2 maximum
    const actualCount = Math.min(count, 2);

    for (let i = 0; i < actualCount; i++) {
        planets.push({
            id: i,
            size: 15 + Math.random() * 20,
            top: Math.random() * height,
            left: Math.random() * width
        });
    }

    return planets;
};

// Générateur d'étoiles filantes
const generateShootingStars = (dimensions) => {
    const { width, height } = dimensions;
    // Déclarer le tableau à l'extérieur pour pouvoir le retourner
    return [];
};

const SpaceBackground = ({ children }) => {
    // Utiliser les dimensions de la fenêtre
    const dimensions = Dimensions.get("window");

    // Générer les étoiles et les planètes une seule fois avec moins d'éléments
    const stars = useMemo(() => generateStars(80, dimensions), []); // Réduit à 80 au lieu de 200
    const planets = useMemo(() => generatePlanets(1, dimensions), []); // Réduit à 1 au lieu de 3

    // État pour les étoiles filantes
    const [shootingStars, setShootingStars] = useState([]);

    // Fonction pour créer une nouvelle étoile filante
    const createShootingStar = () => {
        const { width, height } = dimensions;
        const id = Date.now();

        // Position de départ aléatoire mais généralement en haut de l'écran
        const startX = Math.random() * width;
        const startY = Math.random() * (height * 0.7); // Plutôt dans la partie supérieure

        // Angle de trajectoire (de préférence vers le bas)
        // Entre 0.6π et 1.4π radians (descendant)
        const angle = (0.6 + Math.random() * 0.8) * Math.PI;

        // Taille et durée
        const size = 1 + Math.random() * 2;
        const duration = 1000 + Math.random() * 2000;

        return { id, startX, startY, angle, size, duration };
    };

    // Effet pour générer périodiquement des étoiles filantes
    useEffect(() => {
        // Ajouter la première étoile filante
        setShootingStars([createShootingStar()]);

        // Configurer un intervalle pour ajouter de nouvelles étoiles filantes
        const interval = setInterval(() => {
            setShootingStars(current => {
                // Supprimer les étoiles filantes trop anciennes (plus de 5)
                const recent = current.length > 5
                    ? current.slice(current.length - 5)
                    : [...current];

                // Ajouter une nouvelle étoile filante
                return [...recent, createShootingStar()];
            });
        }, 2000); // Nouvelle étoile filante toutes les 2 secondes

        return () => clearInterval(interval);
    }, [dimensions]);

    return (
        <View style={styles.container}>
            {/* Fond spatial */}
            <View style={styles.background}>
                {/* Gradient de fond pour l'espace profond */}
                <LinearGradient
                    colors={['#070C35', '#0A1245', '#1A1C55']}
                    style={styles.spaceBackground}
                />

                {/* Nébuleuse statique - une seule au lieu de trois */}
                <Nebula
                    style={styles.nebula1}
                    colors={['rgba(111, 66, 193, 0.01)', 'rgba(147, 112, 219, 0.25)', 'rgba(111, 66, 193, 0.15)']}
                />

                {/* Planètes statiques */}
                {planets.map((planet) => (
                    <Planet
                        key={`planet-${planet.id}`}
                        size={planet.size}
                        top={planet.top}
                        left={planet.left}
                    />
                ))}

                {/* Étoiles statiques */}
                {stars.map((star) => (
                    <Star
                        key={`star-${star.id}`}
                        size={star.size}
                        top={star.top}
                        left={star.left}
                        color={star.color}
                    />
                ))}

                {/* Étoiles filantes */}
                {shootingStars.map((shootingStar) => (
                    <ShootingStar
                        key={`shooting-star-${shootingStar.id}`}
                        startX={shootingStar.startX}
                        startY={shootingStar.startY}
                        angle={shootingStar.angle}
                        size={shootingStar.size}
                        duration={shootingStar.duration}
                    />
                ))}
            </View>

            {/* Contenu de l'application */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    background: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
    },
    spaceBackground: {
        flex: 1,
    },
    nebulaGradient: {
        width: "100%",
        height: "100%",
        borderRadius: 9999,
    },
    nebula1: {
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: 200,
        top: "15%",
        left: "5%",
        opacity: 0.4
    },
    star: {
        position: "absolute",
        shadowColor: "#ffffff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    shootingStar: {
        position: "absolute",
        backgroundColor: "#FFFFFF",
        borderRadius: 50,
        shadowColor: "#FFFFFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    planet: {
        borderRadius: 9999,
        shadowColor: "#ffffff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        overflow: 'hidden',
    },
    planetSurface: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 9999,
    },
    content: {
        flex: 1,
        position: "relative",
        backgroundColor: "transparent",
    }
});

export default SpaceBackground;