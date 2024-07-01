import React, { FC, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, Alert, Image, View } from "react-native";
import { User, setUser } from "../Models/UserModel";

const ProfilePage: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [data, setData] = useState<User | null>(null);

    useEffect(() => {
        const fetchData = () => {
            const user = route.params.user;
            setData(user);
        };
        fetchData();
    }, []);

    if (!data) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: data.image }} style={styles.profileImage} />
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.email}>{data.email}</Text>
            <Text style={styles.bio}>{data.bio}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
    },
    email: {
        fontSize: 18,
        color: "gray",
    },
    bio: {
        fontSize: 16,
        marginTop: 10,
        textAlign: "center",
    },
});

export default ProfilePage;
