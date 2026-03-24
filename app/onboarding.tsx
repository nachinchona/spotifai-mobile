import { styles } from "@/src/style/onboarding-styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter()

  const handleFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      
      router.replace("/"); 
      
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <LinearGradient
      colors={["#1DB954", "#121212"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.6 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Image 
                source={require("../assets/images/iconofaigrande.png")} 
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
          </View>

          <Text style={styles.title}>SpotiFAI</Text>
          <Text style={styles.subtitle}>Descubre y explora tus playlists favoritas en un solo lugar</Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>🎧</Text>
              </View>
              <Text style={styles.featureText}>Explora playlists</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>📱</Text>
              </View>
              <Text style={styles.featureText}>Nueva interfaz</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>⚡</Text>
              </View>
              <Text style={styles.featureText}>Más rápida</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleFinishOnboarding} 
          >
            <Text style={styles.buttonText}>Ver Mis Playlists</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

