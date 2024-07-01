import LottieView from "lottie-react-native";
import React, { useRef, useEffect, FC } from "react";
export const ActivityIndicator: FC<{ visible: boolean }> = ({ visible }) => {
    const animation = useRef(null);
    if (!visible) {
        return null;
    } else {
        return (
            <LottieView
                autoPlay
                loop
                source={require("../animations/loading.json")}
                ref={animation}
                style={{
                    width: 400,
                    height: 240,
                }}
            ></LottieView>
        );
    }
};
