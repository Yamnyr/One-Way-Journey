import { Alert } from 'react-native';

/**
 * Show an alert with a title and message
 */
export const showAlert = (title, message) => {
    Alert.alert(title, message);
};

/**
 * Format a stat name to a readable format
 */
export const formatStatName = (stat) => {
    const statMap = {
        life: "Vie",
        charisma: "Charisme",
        dexterity: "Dextérité",
        intelligence: "Intelligence",
        luck: "Chance",
    };
    return statMap[stat] || stat;
};

/**
 * Get icon for a stat
 */
export const getStatIcon = (stat) => {
    const iconMap = {
        life: "❤️",
        charisma: "✨",
        dexterity: "🏃",
        intelligence: "🧠",
        luck: "🍀",
    };
    return iconMap[stat] || "📊";
};

/**
 * Check if a value is positive, negative or neutral and return a style name
 */
export const getValueStyle = (value) => {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
};