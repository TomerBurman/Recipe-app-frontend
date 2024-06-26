// import React, { FC } from "react";
// import {
//     View,
//     TouchableHighlight,
//     Image,
//     Text,
//     StyleSheet,
// } from "react-native";
// import { User } from "../Models/UserModel";

// const UserRow: FC<{
//     route: any;
//     navigation: any;
//     user: User;
//     onItemSelected: (id: string) => void;
// }> = ({ navigation, route, user, onItemSelected }) => {
//     const onPress = () => {
//         console.log("Row pressed");
//         onItemSelected(user.id);
//     };

//     const getImageSource = (imgPath: string) => {
//         switch (imgPath) {
//             case "../assets/icon.png":
//                 return require("../assets/icon.png");
//             // Add more cases as needed
//             default:
//                 return require("../assets/default.png"); // Default image
//         }
//     };

//     return (
//         <TouchableHighlight onPress={onPress} underlayColor={"grey"}>
//             <View style={styles.listrow}>
//                 <Image
//                     style={styles.image}
//                     source={getImageSource(user.imgUrl)}
//                 />
//                 <View style={styles.info}>
//                     <Text style={styles.name}>{user.name}</Text>
//                     <Text style={styles.id}>{user.id}</Text>
//                 </View>
//             </View>
//         </TouchableHighlight>
//     );
// };

// const styles = StyleSheet.create({
//     listrow: {
//         marginHorizontal: 5,
//         flexDirection: "row",
//         elevation: 1,
//         borderRadius: 2,
//     },
//     info: {
//         flexDirection: "column",
//         justifyContent: "center",
//     },
//     image: {
//         height: 100,
//         width: 100,
//     },
//     name: {
//         marginBottom: 5,
//         fontSize: 20,
//         fontWeight: "bold",
//     },
//     id: {
//         marginBottom: 5,
//         fontSize: 15,
//     },
// });

// export default UserRow;
