import { View, ActivityIndicator, StyleSheet } from "react-native"

const LoadingView = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="rgb(219, 4, 198)" style={styles.loader} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loader: {
        marginTop: 20,
    },
})

export default LoadingView
