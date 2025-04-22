// SplashScreenComponent.tsx
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const window = Dimensions.get("window");

export default function SplashScreenComponent({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const player = useVideoPlayer(
    { uri: "android.resource://com.almarsa.app/raw/smile_splash" }, // <-- use uri here
    (player) => {
      player.loop = false;
      player.play();
    }
  );

  useEffect(() => {
    // Add fallback timeout in case video playback fails
    const timeout = setTimeout(() => {
      console.log("Fallback timeout triggered");
      onFinish();
    }, 5000); // 5 second safety fallback

    // Correct event name for expo-video
    player.addListener("playToEnd", () => {
      console.log("Video played to end");
      clearTimeout(timeout);
      onFinish();
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [onFinish, player]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black", // Match this to your video's first frame
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
