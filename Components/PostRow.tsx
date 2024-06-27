import React, { FC } from "react";
import {
    View,
    TouchableHighlight,
    Image,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";

const Post: FC<{
    id: string;
    title: string;
    owner: string;
    imgs: string[];
    onItemSelected: (id: string) => void;
}> = ({ title, imgs, owner, id, onItemSelected }) => {
    const onPress = () => {
        onItemSelected(id);
    };

    return (
        <TouchableHighlight onPress={onPress} underlayColor={"grey"}>
            <View style={styles.listrow}>
                <ScrollView horizontal>
                    {imgs && imgs.length > 0 ? (
                        imgs.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img }}
                                style={styles.image}
                            />
                        ))
                    ) : (
                        <View style={styles.placeholder} />
                    )}
                </ScrollView>
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
    placeholder: {
        width: 100,
        height: 100,
        marginRight: 10,
        backgroundColor: "#ccc",
    },
    image: {
        height: 50,
        width: 50,
        marginRight: 5, // Add some space between images
        borderRadius: 50,
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
