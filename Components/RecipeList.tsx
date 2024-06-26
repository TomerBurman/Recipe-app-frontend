import React, { FC, useState } from "react";
import Post from "./PostRow";
import { FlatList, StyleSheet, Text, Alert } from "react-native";
import { Recipe } from "../Models/RecipeModel";

const RecipeList: FC<{ route: any; navigation: any; data: Recipe[] }> = ({
    route,
    navigation,
    data,
}) => {
    const onItemSelected = (id: string) => {
        Alert.alert("Item selected" + id);
    };
    return (
        <FlatList
            style={styles.Flatlist}
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <Post
                    id={item._id}
                    title={item.title}
                    owner={item.ownerName}
                    imgs={
                        Array.isArray(item.images) && item.images.length > 0
                            ? item.images
                            : [
                                  "https://i.vimeocdn.com/portrait/58832_300x300.jpg",
                              ]
                    }
                    onItemSelected={onItemSelected}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    Flatlist: {
        flex: 1,
        width: "100%",
    },
});

export default RecipeList;
