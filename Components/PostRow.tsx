import React, { FC } from "react";
import {
    View,
    TouchableHighlight,
    Image,
    Text,
    StyleSheet,
} from "react-native";

const Post: FC<{
    id: string;
    title: string;
    img: string;
    owner: string;
    onItemSelected: (id: string) => void;
}> = ({ title, img, owner, id, onItemSelected }) => {
    const onPress = () => {
        console.log("Row pressed");
        onItemSelected(id);
    };
    return (
        <TouchableHighlight onPress={onPress} underlayColor={"grey"}>
            <View style={styles.listrow}>
                <Image style={styles.image} source={{ uri: img }} />
                <View style={styles.info}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.owner}>{owner}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    listrow: {
        marginHorizontal: 5,
        flexDirection: "row",
        elevation: 1,
        borderRadius: 2,
        justifyContent: "center",
        alignItems: "center", // Center items vertically
        padding: 10,
    },
    info: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center", // Center text horizontally
        flex: 1, // Ensure it takes up remaining space
    },
    image: {
        height: 100,
        width: 100,
        marginRight: 10, // Add some space between image and text
    },
    title: {
        marginBottom: 5,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    owner: {
        fontSize: 16,
        textAlign: "center",
    },
});

export default Post;
