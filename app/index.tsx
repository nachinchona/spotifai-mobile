import { IP_ADDRESS } from "@/src/api";
import { styles } from "@/src/style/index-styles";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Playlist } from '../interfaces/Playlist';
// Mapeo opcional para traducir nombres si quieres mantenerlo
const GENRE_TRANSLATIONS: Record<string, string> = {
  "argentine rock": "Rock Nacional",
  "pop": "Pop",
  "cumbia": "Cumbia",
  "indie": "Indie",
  "hip hop": "Hip Hop",
  "rock": "Rock",
  "reggaeton": "Reggaeton",
  "trap latino": "Trap",
  "Argentine Trap": "Trap Argentino"
};

export default function PlaylistsScreen() {
  const router = useRouter()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [ultimaID, setUltimaID] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Estados para filtros dinámicos
  const [dynamicFilters, setDynamicFilters] = useState<{ id: string, label: string }[]>([
    { id: "Todos", label: "Todos" },
  ]);
  const [activeFilterId, setActiveFilterId] = useState("Todos");

  const fetchPlaylists = async (fromId: number = 0) => {
    if (!IP_ADDRESS) {
      setError("Error: EXPO_PUBLIC_IP_ADDRESS no está configurada")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`http://${IP_ADDRESS}/api/playlist/?from=${fromId}`)

      if (!response.ok) {
        if (response.status === 404) {
          setLoading(false)
          return
        }
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const data = await response.json()

      if (data && data.playlists) {
        if (data.playlists.length !== 0) {
          setPlaylists((prev) => {
            const nuevasUnicas = data.playlists.filter(
              (nueva: Playlist) => !prev.some((existente) => existente.id === nueva.id),
            )
            const updatedList = [...prev, ...nuevasUnicas];
            generateDynamicFilters(updatedList);
            return updatedList
          })
          setUltimaID(data.ultimaID)
          setError(null)
        }
      }
    } catch (error) {
      console.error("Error al cargar datos:", error)
      setError(`Error de conexion: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // Al volver a esta pantalla, resetear y re-fetchear todo desde el servidor|
  useFocusEffect(
    useCallback(() => {
      setPlaylists([]);
      setUltimaID(0);
      setLoading(true);
      fetchPlaylists(0);
    }, [])
  );

  const generateDynamicFilters = (currentPlaylists: Playlist[]) => {
    const genreCounts: Record<string, number> = {};

    currentPlaylists.forEach(playlist => {
      if (playlist.genres) {
        playlist.genres.forEach(genre => {
          const lowerGenre = genre.toLowerCase();
          genreCounts[lowerGenre] = (genreCounts[lowerGenre] || 0) + 1;
        });
      }
    });

    const sortedGenres = Object.entries(genreCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([genre]) => genre)
      .slice(0, 20);

    const newFilters = sortedGenres.map(g => ({
      id: g,
      label: formatGenreLabel(g)
    }));

    setDynamicFilters([
      { id: "Todos", label: "Todos" },
      ...newFilters
    ]);
  };

  const formatGenreLabel = (genre: string) => {
    const translated = GENRE_TRANSLATIONS[genre.toLowerCase()];
    if (translated) return translated;                          // no funciona bien
    return genre.charAt(0).toUpperCase() + genre.slice(1);
  };

  const filteredPlaylists = useMemo(() => {
    let result = [...playlists];

    if (activeFilterId === "Todos") {
      return result;
    }

    // Filtramos por la propiedad isFavorite
    if (activeFilterId === "Favoritos") {
      return result.filter(p => p.isFavorite === true);
    }

    // Filtrado por coincidencia de género
    return result.filter(p =>
      p.genres && p.genres.some(genre => genre.toLowerCase().includes(activeFilterId.toLowerCase())
      )
    );
  }, [playlists, activeFilterId]);

  const formatGenresList = (genres: string[] | undefined) => {
    if (!genres || genres.length === 0) return "Varios";
    return genres
      .slice(0, 3)
      .map(g => GENRE_TRANSLATIONS[g.toLowerCase()] || g)
      .join(" • ");
  };

  const handlePress = (playlistID: string) => {
    console.log(`EN INDEX /playlist/${playlistID}`)
    router.push(`/playlist/${playlistID}`);
  }





const toggleFavorite = async (idPlaylist: number, currentState: boolean | undefined) => {
    const newState = !currentState;
    
    setPlaylists(prev => prev.map(p => 
      p.id === idPlaylist ? { ...p, isFavorite: newState } : p
    ));

    try {
       const response = await fetch(`http://${IP_ADDRESS}/api/playlist/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idPlaylist: idPlaylist,
          isFavorite: newState
        })
      });

      if (!response.ok) throw new Error("Error en el servidor");
      
    } catch (error) {
      console.error(error);
     
      setPlaylists(prev => prev.map(p => 
        p.id === idPlaylist ? { ...p, isFavorite: currentState } : p
      ));
    }
  };





 const renderItem = ({ item }: { item: Playlist }) => {
    return (
      <Pressable style={styles.card} onPress={() => { handlePress(String(item.id)); }}>
        <Image
          source={{ uri: item.images?.[0]?.url || '../assets/images/iconofaigrande.png' }}
          style={styles.playlistImage}
        />
        <View style={styles.textContainer}>
          
          {/* NUEVO: Contenedor en fila para el Título y el Corazón */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={[styles.playlistName, { flex: 1 }]} numberOfLines={1}>
              {item.name}
            </Text>
            
            {/* BOTÓN DE CORAZÓN */}
            <Pressable 
              onPress={(e) => {
                e.stopPropagation(); // Evita que al tocar el corazón se abra la playlist
                toggleFavorite(item.id, item.isFavorite);
              }}
              style={{ paddingLeft: 10, paddingBottom: 5 }}
            >
              <Text style={{ fontSize: 20 }}>{item.isFavorite ? '❤️' : '🤍'}</Text>
            </Pressable>
          </View>

          <Text style={styles.genreTag}>
            {formatGenresList(item.genres)}
          </Text>

          <Text style={styles.playlistDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.trackCount}>{item.tracks?.items?.length || 0} canciones</Text>
        </View>
      </Pressable>
    );
  }


 const renderTabs = () => (
    <View style={[styles.tabsContainer, { flexDirection: 'row', alignItems: 'center' }]}>
      
      {/* BOTÓN FIJO DE FAVORITOS */}
      <Pressable
        onPress={() => setActiveFilterId("Favoritos")}
        style={[
          styles.tabButton,
          activeFilterId === "Favoritos" && styles.tabButtonActive,
          { marginLeft: 5 } // Margen para separarlo del borde
        ]}
      >
        <Text style={[styles.tabText, activeFilterId === "Favoritos" && styles.tabTextActive]}>
          {activeFilterId === "Favoritos" ? "❤️ Favs" : "🤍 Favs"}
        </Text>
      </Pressable>

      {/* SCROLL DE GÉNEROS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5 }}>
        {dynamicFilters.map((filtro) => (
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
          <Pressable style={styles.retryButton} onPress={() => fetchPlaylists(0)}>
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
              : "No se encontraron playlists de " + activeFilterId}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlaylists}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={activeFilterId === "Todos" ? () => fetchPlaylists(ultimaID) : null}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator color="#1DB954" style={{ marginTop: 20 }} /> : null}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  )
}
