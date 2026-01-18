import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Playlist } from '../interfaces/Playlist';

const PlaylistsScreen = () => {
  const router = useRouter()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [ultimaID, setUltimaID] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const IP = process.env.EXPO_PUBLIC_IP_ADDRESS
  const PORT = "3000"
  const IP_ADDRESS = IP ? `${IP}:${PORT}` : null

  const fetchPlaylists = async () => {
    if (!IP_ADDRESS) {
      setError("Error: EXPO_PUBLIC_IP_ADDRESS no está configurada")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`http://${IP_ADDRESS}/api/playlist/?from=${ultimaID}`)

      if (!response.ok) {
        if (response.status === 404) {
          setLoading(false)
          return
        }
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const data = await response.json()

      if (data && data.playlists) {
        setPlaylists((prev) => {
          const nuevasUnicas = data.playlists.filter(
            (nueva: Playlist) => !prev.some((existente) => existente.id === nueva.id),
          )
          return [...prev, ...nuevasUnicas]
        })

        setUltimaID(data.ultimaID)
        setError(null)
      }
    } catch (error) {
      console.error("Error al cargar datos:", error)
      setError(`Error de conexion: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const renderItem = ({ item }: { item: Playlist }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.images?.[0]?.url }} style={styles.playlistImage} />
      <View style={styles.textContainer}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.trackCount}>{item.tracks?.items?.length || 0} canciones</Text>
      </View>
    </View>
  )

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Mis Playlists</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchPlaylists}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        
        <Text style={styles.headerTitle}>Mis Playlists</Text>
      </View>

      {!loading && playlists.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No hay playlists disponibles</Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={fetchPlaylists}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator color="#1DB954" /> : null}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "600",
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
  },
  playlistImage: {
    width: 100,
    height: 100,
  },
  textContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  playlistName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  playlistDescription: {
    color: "#b3b3b3",
    fontSize: 12,
    marginTop: 4,
  },
  trackCount: {
    color: "#1DB954",
    fontSize: 11,
    marginTop: 8,
    fontWeight: "bold",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyText: {
    color: "#b3b3b3",
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default PlaylistsScreen
