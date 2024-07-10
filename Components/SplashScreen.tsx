import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "./ActivityIndicator";

const SplashScreen: FC = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator visible={true} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});

export default SplashScreen;
