import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Animated, Dimensions, Easing } from "react-native";

// Composant pour une étoile
const Star = ({ size, top, left, delay }) => {
    const opacity = useRef(new Animated.Value(0.2)).current;
    const scale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Animation d'opacité
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1500 + Math.random() * 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(opacity, {
                    toValue: 0.2,
                    duration: 1500 + Math.random() * 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                })
            ])
        ).start();

        // Animation de taille
        const animationTimeout = setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scale, {
                        toValue: 1.2,
                        duration: 2000 + Math.random() * 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true
                    }),
                    Animated.timing(scale, {
                        toValue: 0.8,
                        duration: 2000 + Math.random() * 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true
                    })
                ])
            ).start();
        }, delay);

        return () => clearTimeout(animationTimeout);
    }, []);

    return (
        <Animated.View
            style={[
                styles.star,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    top,
                    left,
                    opacity,
                    transform: [{ scale }]
                }
            ]}
        />
    );
};

// Composant pour générer les étoiles filantes
const ShootingStar = () => {
    const { width, height } = Dimensions.get("window");
    const translateX = useRef(new Animated.Value(-50)).current;
    const translateY = useRef(new Animated.Value(-50)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    // Position aléatoire pour commencer
    const startX = Math.random() * width;
    const startY = Math.random() * (height / 3);

    useEffect(() => {
        const runAnimation = () => {
            // Réinitialiser les positions
            translateX.setValue(-50);
            translateY.setValue(-50);
            opacity.setValue(0);

            // Attente aléatoire avant de commencer
            const delay = Math.random() * 5000 + 2000;

            setTimeout(() => {
                Animated.parallel([
                    // Apparition
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true
                    }),
                    // Animation de l'étoile filante
                    Animated.timing(translateX, {
                        toValue: width + 100,
                        duration: 2000,
                        easing: Easing.linear,
                        useNativeDriver: true
                    }),
                    Animated.timing(translateY, {
                        toValue: height + 100,
                        duration: 2000,
                        easing: Easing.linear,
                        useNativeDriver: true
                    })
                ]).start(() => {
                    // Disparition
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true
                    }).start(() => {
                        // Relancer l'animation
                        runAnimation();
                    });
                });
            }, delay);
        };

        runAnimation();

        return () => {
            // Cleanup if needed
        };
    }, []);

    return (
        <Animated.View
            style={[
                styles.shootingStar,
                {
                    left: startX,
                    top: startY,
                    opacity,
                    transform: [
                        { translateX },
                        { translateY },
                        { rotate: '45deg' }
                    ]
                }
            ]}
        />
    );
};

// Animation de la nébuleuse
const NebulaAnimation = ({ style }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(0.1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 1.2,
                        duration: 8000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.2,
                        duration: 8000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true
                    })
                ]),
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 8000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.1,
                        duration: 8000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true
                    })
                ])
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                style,
                {
                    opacity,
                    transform: [{ scale }]
                }
            ]}
        />
    );
};

// Génère les étoiles aléatoirement
const generateStars = (count) => {
    const { width, height } = Dimensions.get("window");
    const stars = [];

    for (let i = 0; i < count; i++) {
        stars.push({
            id: i,
            size: 1 + Math.random() * 3,
            top: Math.random() * height,
            left: Math.random() * width,
            delay: Math.random() * 1000
        });
    }

    return stars;
};

export default function AppWrapper({ children }) {
    // Génère 150 étoiles pour plus de densité
    const [stars] = useState(generateStars(150));
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));

    useEffect(() => {
        const subscription = Dimensions.addEventListener(
            "change",
            ({ window }) => {
                setDimensions(window);
            }
        );
        return () => subscription?.remove();
    }, []);

    return (
        <View style={styles.container}>
            {/* Fond animé spatial */}
            <View style={styles.background}>
                <View style={styles.spaceBackground}>
                    {/* Gradient de couleur pour simuler des nébuleuses */}
                    <NebulaAnimation style={styles.nebula1} />
                    <NebulaAnimation style={styles.nebula2} />
                    <NebulaAnimation style={styles.nebula3} />
                </View>

                {/* Étoiles statiques et animées */}
                {stars.map((star) => (
                    <Star
                        key={star.id}
                        size={star.size}
                        top={star.top}
                        left={star.left}
                        delay={star.delay}
                    />
                ))}

                {/* Étoiles filantes */}
                <ShootingStar />
                <ShootingStar />
                <ShootingStar />
                <ShootingStar />
                <ShootingStar />
            </View>

            {/* Contenu de l'application */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

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
        backgroundColor: "#050A30", // Couleur bleu foncé pour l'espace
    },
    nebula1: {
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: "rgba(111, 66, 193, 0.15)", // Nébuleuse violette
        top: "20%",
        left: "10%",
        shadowColor: "#9747FF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 40,
    },
    nebula2: {
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: "rgba(47, 85, 151, 0.15)", // Nébuleuse bleue
        bottom: "15%",
        right: "5%",
        shadowColor: "#3C7EFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 40,
    },
    nebula3: {
        position: "absolute",
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: "rgba(199, 28, 228, 0.12)", // Nébuleuse rose
        top: "50%",
        left: "40%",
        shadowColor: "#FF26E2",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 35,
    },
    star: {
        position: "absolute",
        backgroundColor: "#ffffff",
        shadowColor: "#ffffff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
    },
    shootingStar: {
        position: "absolute",
        width: 50,
        height: 2,
        backgroundColor: "#ffffff",
        shadowColor: "#ffffff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    content: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "transparent",
    }
});