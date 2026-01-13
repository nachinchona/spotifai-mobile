import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, router } from "expo-router"; // Quitamos Redirect, usamos router
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);

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

  // Efecto separado para navegar SOLO cuando terminamos de cargar
  useEffect(() => {
    if (!isLoading && isFirstTime) {
      router.replace('/onboarding');
    }
  }, [isLoading, isFirstTime]);

  // 1. Pantalla de carga (Spinner)
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  // 2. Renderizamos SIEMPRE el Stack
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Tu archivo principal se llama index.tsx, así que el nombre es "index" */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        
        {/* ¡BORRÉ LA LÍNEA DE PLAYLISTS PORQUE ESE ARCHIVO NO EXISTE EN TU FOTO! */}
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}