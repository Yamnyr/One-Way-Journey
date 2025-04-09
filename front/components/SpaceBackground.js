import React, { useEffect, useState, useRef, useMemo } from "react";
import { StyleSheet, View, Animated, Dimensions, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Composant pour une étoile avec effet de scintillement amélioré
const Star = ({ size, top, left, delay, color = "#ffffff" }) => {
    const opacity = useRef(new Animated.Value(0.2)).current;
    const scale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Animation d'opacité avec timing aléatoire pour un effet plus naturel
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1500 + Math.random() * 1500,
                    easing: Easing.inOut(Easing.cubic),
                    useNativeDriver: true
                }),
                Animated.timing(opacity, {
                    toValue: 0.2,
                    duration: 1500 + Math.random() * 1500,
                    easing: Easing.inOut(Easing.cubic),
                    useNativeDriver: true
                })
            ])
        ).start();

        // Animation de taille avec délai pour désynchroniser les étoiles
        const animationTimeout = setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scale, {
                        toValue: 1.2,
                        duration: 2000 + Math.random() * 1500,
                        easing: Easing.inOut(Easing.cubic),
                        useNativeDriver: true
                    }),
                    Animated.timing(scale, {
                        toValue: 0.8,
                        duration: 2000 + Math.random() * 1500,
                        easing: Easing.inOut(Easing.cubic),
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
                    backgroundColor: color,
                    shadowColor: color,
                    transform: [{ scale }]
                }
            ]}
        />
    );
};

// Composant pour une étoile avec des rayons
const StarWithRays = ({ size, top, left, delay }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animation d'opacité
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 2000 + Math.random() * 1000,
                    easing: Easing.inOut(Easing.cubic),
                    useNativeDriver: true
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 2000 + Math.random() * 1000,
                    easing: Easing.inOut(Easing.cubic),
                    useNativeDriver: true
                })
            ])
        ).start();

        // Animation de rotation lente
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 20000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();

        return () => {
            // Cleanup
        };
    }, []);

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={{ position: 'absolute', top, left }}>
            <Animated.View
                style={{
                    width: size * 3,
                    height: size * 3,
                    position: 'absolute',
                    opacity,
                    transform: [
                        { translateX: -size * 1.5 },
                        { translateY: -size * 1.5 },
                        { rotate: spin }
                    ]
                }}
            >
                {/* Rayons horizontaux */}
                <View style={[styles.starRay, { width: size * 3, height: 1, top: size * 1.5 }]} />
                {/* Rayons verticaux */}
                <View style={[styles.starRay, { width: 1, height: size * 3, left: size * 1.5 }]} />
                {/* Rayons diagonaux */}
                <View style={[styles.starRay, { width: size * 2, height: 1, top: size * 1.5, left: size * 0.5, transform: [{ rotate: '45deg' }] }]} />
                <View style={[styles.starRay, { width: size * 2, height: 1, top: size * 1.5, left: size * 0.5, transform: [{ rotate: '135deg' }] }]} />
            </Animated.View>

            {/* Étoile centrale */}
            <Animated.View
                style={[
                    styles.brightStar,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        opacity,
                        transform: [
                            { translateX: -size / 2 },
                            { translateY: -size / 2 }
                        ]
                    }
                ]}
            />
        </View>
    );
};

// Composant pour générer les étoiles filantes améliorées
const ShootingStar = () => {
    const { width, height } = Dimensions.get("window");
    const translateX = useRef(new Animated.Value(-100)).current;
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const trailLength = useRef(new Animated.Value(30)).current;

    // Position aléatoire pour commencer
    const startX = Math.random() * width;
    const startY = Math.random() * (height / 3);
    // Direction aléatoire (angle en degrés)
    const angle = Math.random() * 30 + 30; // Entre 30 et 60 degrés

    useEffect(() => {
        const runAnimation = () => {
            // Réinitialiser les positions
            translateX.setValue(-100);
            translateY.setValue(-100);
            opacity.setValue(0);
            trailLength.setValue(30);

            // Attente aléatoire avant de commencer
            const delay = Math.random() * 10000 + 2000;

            setTimeout(() => {
                // Calculer la distance à parcourir en fonction de l'angle
                const distance = Math.sqrt(width * width + height * height) * 1.5;
                const moveX = Math.cos(angle * Math.PI / 180) * distance;
                const moveY = Math.sin(angle * Math.PI / 180) * distance;

                Animated.sequence([
                    // Apparition
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true
                    }),
                    // Animation de l'étoile filante
                    Animated.parallel([
                        Animated.timing(translateX, {
                            toValue: moveX,
                            duration: 1500,
                            easing: Easing.linear,
                            useNativeDriver: true
                        }),
                        Animated.timing(translateY, {
                            toValue: moveY,
                            duration: 1500,
                            easing: Easing.linear,
                            useNativeDriver: true
                        }),
                        Animated.timing(trailLength, {
                            toValue: 80,
                            duration: 1000,
                            easing: Easing.cubic,
                            useNativeDriver: false
                        })
                    ]),
                    // Disparition
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true
                    })
                ]).start(() => {
                    // Relancer l'animation
                    runAnimation();
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
                {
                    position: "absolute",
                    left: startX,
                    top: startY,
                    opacity,
                    transform: [
                        { translateX },
                        { translateY },
                        { rotate: `${angle}deg` }
                    ]
                }
            ]}
        >
            {/* Traînée lumineuse */}
            <Animated.View
                style={{
                    width: trailLength,
                    height: 2,
                    backgroundColor: "#ffffff",
                    borderRadius: 1,
                    shadowColor: "#ffffff",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 8,
                }}
            />
            {/* Point lumineux (tête de l'étoile) */}
            <View
                style={{
                    position: "absolute",
                    right: -4,
                    top: -4,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#ffffff",
                    shadowColor: "#ffffff",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 8,
                }}
            />
        </Animated.View>
    );
};

// Nébuleuse améliorée avec gradient interne
const Nebula = ({ style, colors, positions }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(0.1)).current;
    const rotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animation complexe pour la nébuleuse
        Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 1.15,
                        duration: 15000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.25,
                        duration: 15000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true
                    }),
                    Animated.timing(rotate, {
                        toValue: 1,
                        duration: 60000,
                        easing: Easing.linear,
                        useNativeDriver: true
                    })
                ]),
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 15000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.15,
                        duration: 15000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true
                    })
                ])
            ])
        ).start();
    }, []);

    const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <Animated.View
            style={[
                style,
                {
                    opacity,
                    transform: [
                        { scale },
                        { rotate: spin }
                    ]
                }
            ]}
        >
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nebulaGradient}
            />
        </Animated.View>
    );
};

// Planète avec anneaux ou lune en orbite
const Planet = ({ size, top, left }) => {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 60000, // Une rotation complète par minute
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();
    }, []);

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    // Choisir aléatoirement entre une planète avec anneaux ou une lune
    const hasMoon = Math.random() > 0.5;
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

            {/* Anneaux ou lune en orbite */}
            <Animated.View
                style={{
                    position: 'absolute',
                    width: size * 2.5,
                    height: size * 2.5,
                    top: -size * 0.75,
                    left: -size * 0.75,
                    transform: [{ rotate: spin }]
                }}
            >
                {hasMoon ? (
                    // Lune
                    <View style={[
                        styles.moon,
                        {
                            width: size * 0.3,
                            height: size * 0.3,
                            top: 0,
                            left: size * 2.1
                        }
                    ]} />
                ) : (
                    // Anneaux
                    <View style={[
                        styles.planetRings,
                        {
                            width: size * 2.5,
                            height: size * 0.8,
                            top: size * 0.85,
                            left: 0
                        }
                    ]} />
                )}
            </Animated.View>
        </View>
    );
};

// Générateur de particules d'étoiles optimisé
const generateStars = (count, dimensions) => {
    const { width, height } = dimensions;
    const stars = [];

    // Différentes tailles d'étoiles pour plus de profondeur
    const sizeCategoriesCount = {
        tiny: Math.floor(count * 0.6),     // 60% petites étoiles
        small: Math.floor(count * 0.25),   // 25% étoiles moyennes
        medium: Math.floor(count * 0.1),   // 10% grandes étoiles
        bright: Math.floor(count * 0.05)   // 5% étoiles très brillantes avec rayons
    };

    // Générer les étoiles par catégories
    let id = 0;

    // Petites étoiles (fond)
    for (let i = 0; i < sizeCategoriesCount.tiny; i++) {
        stars.push({
            id: id++,
            size: 0.5 + Math.random() * 1,
            top: Math.random() * height,
            left: Math.random() * width,
            delay: Math.random() * 2000,
            color: Math.random() > 0.3 ? "#ffffff" : "#B7E5FF" // Certaines avec teinte bleutée
        });
    }

    // Étoiles moyennes
    for (let i = 0; i < sizeCategoriesCount.small; i++) {
        stars.push({
            id: id++,
            size: 1.5 + Math.random() * 1.5,
            top: Math.random() * height,
            left: Math.random() * width,
            delay: Math.random() * 2000,
            color: Math.random() > 0.5 ? "#ffffff" : "#FFF4E0" // Certaines avec teinte jaunâtre
        });
    }

    // Grandes étoiles
    for (let i = 0; i < sizeCategoriesCount.medium; i++) {
        stars.push({
            id: id++,
            size: 2.5 + Math.random() * 1.5,
            top: Math.random() * height,
            left: Math.random() * width,
            delay: Math.random() * 2000,
            color: Math.random() > 0.7 ? "#ffffff" : "#FFE4B5" // Certaines orangées
        });
    }

    // Étoiles brillantes avec rayons
    for (let i = 0; i < sizeCategoriesCount.bright; i++) {
        stars.push({
            id: id++,
            type: "bright",
            size: 3 + Math.random() * 2,
            top: Math.random() * height,
            left: Math.random() * width,
            delay: Math.random() * 2000
        });
    }

    return stars;
};

// Générateur de planètes
const generatePlanets = (count, dimensions) => {
    const { width, height } = dimensions;
    const planets = [];

    for (let i = 0; i < count; i++) {
        planets.push({
            id: i,
            size: 15 + Math.random() * 25,
            top: Math.random() * height,
            left: Math.random() * width
        });
    }

    return planets;
};

const SpaceBackground = ({ children }) => {
    // Utiliser les dimensions de la fenêtre
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));

    // Générer les étoiles et les planètes une seule fois
    const stars = useMemo(() => generateStars(200, dimensions), [dimensions]);
    const planets = useMemo(() => generatePlanets(3, dimensions), [dimensions]);

    // Suivre les changements de dimensions
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
                {/* Gradient de fond pour l'espace profond */}
                <LinearGradient
                    colors={['#070C35', '#0A1245', '#1A1C55']}
                    style={styles.spaceBackground}
                />

                {/* Nébuleuses améliorées avec gradients */}
                <Nebula
                    style={styles.nebula1}
                    colors={['rgba(111, 66, 193, 0.01)', 'rgba(147, 112, 219, 0.25)', 'rgba(111, 66, 193, 0.15)']}
                    positions={{start: {x: 0, y: 0}, end: {x: 1, y: 1}}}
                />
                <Nebula
                    style={styles.nebula2}
                    colors={['rgba(47, 85, 151, 0.01)', 'rgba(67, 125, 191, 0.25)', 'rgba(47, 85, 151, 0.15)']}
                    positions={{start: {x: 0, y: 1}, end: {x: 1, y: 0}}}
                />
                <Nebula
                    style={styles.nebula3}
                    colors={['rgba(199, 28, 228, 0.01)', 'rgba(219, 68, 248, 0.2)', 'rgba(199, 28, 228, 0.12)']}
                    positions={{start: {x: 1, y: 0}, end: {x: 0, y: 1}}}
                />

                {/* Planètes */}
                {planets.map((planet) => (
                    <Planet
                        key={`planet-${planet.id}`}
                        size={planet.size}
                        top={planet.top}
                        left={planet.left}
                    />
                ))}

                {/* Étoiles */}
                {stars.map((star) => (
                    star.type === "bright" ? (
                        <StarWithRays
                            key={`star-${star.id}`}
                            size={star.size}
                            top={star.top}
                            left={star.left}
                            delay={star.delay}
                        />
                    ) : (
                        <Star
                            key={`star-${star.id}`}
                            size={star.size}
                            top={star.top}
                            left={star.left}
                            delay={star.delay}
                            color={star.color}
                        />
                    )
                ))}

                {/* Étoiles filantes améliorées */}
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
        shadowColor: "#9747FF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 50,
    },
    nebula2: {
        position: "absolute",
        width: 500,
        height: 500,
        borderRadius: 250,
        bottom: "10%",
        right: "5%",
        shadowColor: "#3C7EFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 50,
    },
    nebula3: {
        position: "absolute",
        width: 450,
        height: 450,
        borderRadius: 225,
        top: "45%",
        left: "35%",
        shadowColor: "#FF26E2",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 45,
    },
    star: {
        position: "absolute",
        backgroundColor: "#ffffff",
        shadowColor: "#ffffff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    brightStar: {
        position: "absolute",
        backgroundColor: "#ffffff",
        shadowColor: "#ffffff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    starRay: {
        position: "absolute",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        shadowColor: "#ffffff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    planet: {
        borderRadius: 9999,
        shadowColor: "#ffffff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
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
    planetRings: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 9999,
        transform: [{ scaleY: 0.2 }],
    },
    moon: {
        backgroundColor: 'rgba(220, 220, 220, 0.9)',
        borderRadius: 9999,
        shadowColor: "#ffffff",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    content: {
        flex: 1,
        position: "relative",
        backgroundColor: "transparent",
    }
});

export default SpaceBackground;