// RootLayout.tsx
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import SplashScreenComponent from "./components/SplashScreenComponent";

// Keep the splash screen visible while we prepare resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Add any resource pre-loading here
        // For example: await Font.loadAsync(fonts);

        // Mark app as ready
        setAppIsReady(true);
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    // Once the app is ready, hide the system splash screen
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // If app is not ready, don't render anything
  if (!appIsReady) {
    return null;
  }

  if (showSplash) {
    return (
      <SplashScreenComponent
        onFinish={() => {
          setShowSplash(false);
        }}
      />
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
