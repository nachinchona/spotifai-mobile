import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
        if (hasSeen !== 'true') {
          setIsFirstTime(true);
        }
      } catch (error) {
        console.error("Error checking onboarding:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (!isLoading && isFirstTime) {
      router.replace('/onboarding');
    }
  }, [isLoading, isFirstTime]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{contentStyle: { backgroundColor: '#121212' }, animation: 'slide_from_right'}}>
        <Stack.Screen name="index" options={{ headerShown: false }} />  
        <Stack.Screen name="playlist/[id]" options={{ headerShown: false }} />  
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}