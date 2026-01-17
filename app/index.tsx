import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Playlist } from '../interfaces/Playlist';

//label será lo que se muestre, mientras que el id va a ser el valor que comparemos con el JSON
const FILTROS = [
  { id: "Todos", label: "Todos" },
  { id: "Popular", label: "🔥 Más Populares" }, 
  { id: "argentine rock", label: "🇦🇷 Rock Nacional" },
  { id: "pop", label: "🎤 Pop" },
  { id: "cumbia", label: "🌴 Cumbia" },
  { id: "indie", label: "🎸 Indie" },
  { id: "hip hop", label: "🎧 Hip Hop" },
];
// Mapeo de géneros para mostrar nombres más sencillos
const GENRE_TRANSLATIONS: Record<string, string> = {
  "argentine rock": "Rock Nacional",
  "pop": "Pop Internacional",
  "cumbia": "Cumbia",
  "indie": "Indie Alternativo",
  "hip hop": "Hip Hop / Rap",
  // Si un género no está en este mapeo, se mostrará tal cual viene del JSON
};

const PlaylistsScreen = () => {
  const router = useRouter()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [ultimaID, setUltimaID] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  const [activeFilterId, setActiveFilterId] = useState("Todos");

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

  const filteredPlaylists = useMemo(() => {
    let result = [...playlists];

    if (activeFilterId === "Todos") {
      return result;
    }

    if (activeFilterId === "Popular") {
      return result.sort((a, b) => {
        const getAvgPop = (playlist: Playlist) => {
          const tracks = playlist.tracks?.items || [];
          if (tracks.length === 0) return 0;
          const sum = tracks.reduce((acc, item) => acc + (item.track?.popularity || 0), 0);
          return sum / tracks.length;
        };
        return getAvgPop(b) - getAvgPop(a); 
      });
    }

    return result.filter(p => 
      p.genres && p.genres.some(genre => genre.toLowerCase() === activeFilterId.toLowerCase()
      )
    );

  }, [playlists, activeFilterId]);

  const formatGenresList = (genres: string[]) => {
    if (!genres || genres.length === 0) return "Varios";
    return genres
      .slice(0, 3)
      .map(g => GENRE_TRANSLATIONS[g.toLowerCase()] || g) 
      .join(" • "); 
  };

  const handlePress = (playlistID : string) => {
    router.push(`/playlist/${playlistID}`);
  }

  const renderItem = ({ item }: { item: Playlist }) => (
    <Pressable style={styles.card} onPress={() => {handlePress(String(item.id));}}>
      <Image 
        source={{ uri: item.images?.[0]?.url || '../assets/images/iconofaigrande.png' }} 
        style={styles.playlistImage} 
      />
      <View style={styles.textContainer}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.genreTag}>
          {formatGenresList(item.genres)}
        </Text>

        <Text style={styles.playlistDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.trackCount}>{item.tracks?.items?.length || 0} canciones</Text>
      </View>
    </Pressable>
  )

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5 }}>
        {FILTROS.map((filtro) => (
          <Pressable
            key={filtro.id}
            onPress={() => setActiveFilterId(filtro.id)}
            style={[
              styles.tabButton,
              activeFilterId === filtro.id && styles.tabButtonActive
            ]}
          >
            <Text style={[
              styles.tabText,
              activeFilterId === filtro.id && styles.tabTextActive
            ]}>
              {filtro.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

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
      {renderTabs()}

      {!loading && filteredPlaylists.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {activeFilterId === "Todos" 
              ? "No hay playlists disponibles" 
              : "No se encontraron resultados"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlaylists}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={activeFilterId === "Todos" ? fetchPlaylists : null}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator color="#1DB954" style={{marginTop: 20}} /> : null}
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
  // ESTILOS TABS
  tabsContainer: {
    marginBottom: 15,
    height: 40,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#1e1e1e",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: "#1DB954",
    borderColor: "#1DB954",
  },
  tabText: {
    color: "#b3b3b3",
    fontSize: 14,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#000000",
    fontWeight: "bold",
  },
  // ESTILOS CARD
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
    alignSelf: 'center',
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
  
  genreTag: {
    color: "#1DB954",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 2,
    textTransform: 'capitalize'
  },
  playlistDescription: {
    color: "#b3b3b3",
    fontSize: 12,
    marginTop: 2,
  },
  trackCount: {
    color: "#777",
    fontSize: 11,
    marginTop: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
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