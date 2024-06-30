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
        <TouchableHighlight onPress={onPress} underlayColor={"#f0f0f0"}>
            <View style={styles.listrow}>
                <ScrollView horizontal style={styles.imageScroll}>
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
                    <Text style={styles.owner}>by {owner}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    listrow: {
        marginVertical: 10,
        marginHorizontal: 15,
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        flexDirection: "column",
    },
    imageScroll: {
        marginBottom: 15,
    },
    placeholder: {
        width: 100,
        height: 100,
        marginRight: 10,
        backgroundColor: "#ccc",
        borderRadius: 10,
    },
    image: {
        height: 90,
        width: 90,
        borderRadius: 10,
        marginRight: 10,
    },
    info: {
        flexDirection: "column",
        alignItems: "center",
    },
    title: {
        marginBottom: 5,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    owner: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
});

export default Post;
