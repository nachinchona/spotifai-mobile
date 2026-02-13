import TrackItem from '@/components/TrackPlayer';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Playlist, PlaylistTrackItem } from '../../interfaces/Playlist';

const PlaylistScreen = () => {
  // router
  const router = useRouter();
  const IP = process.env.EXPO_PUBLIC_IP_ADDRESS
  const PORT = "3000"
  const IP_ADDRESS = IP ? `${IP}:${PORT}` : null

  // para playlist
  const { id } = useLocalSearchParams();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // para reproductor
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const fetchPlaylist = async () => {
    if (!IP_ADDRESS) {
      setError("Error: EXPO_PUBLIC_IP_ADDRESS no está configurada")
      return
    }
    try {
      const response = await fetch(`http://${IP_ADDRESS}/api/playlist/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return
        }
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const data = await response.json();

      if (data && data.playlist) {
        setPlaylist(data.playlist);
        setError(null);
      }
    } catch (error) {
      console.error("Error al cargar playlist:", error)
      setError(`Error de conexion: ${error}`)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchPlaylist()
  }, [id])

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
          <Pressable style={styles.retryButton} onPress={fetchPlaylist}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  if (!playlist) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={{ color: 'white', marginTop: 10 }}>Cargando playlist...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: PlaylistTrackItem }) => {
    const isTrackPlaying = status.playing && (activeTrackId === item.track.external_urls.spotify);
    return (
      <TrackItem
        track={item.track}
        previewUrl={item.track.preview_url}
        currentPlayingId={activeTrackId}
        isPlaying={isTrackPlaying}
        onPlayPress={() => handleTogglePlay(item.track.external_urls.spotify, item.track.preview_url)
        }>
        track={item.track}
        previewUrl={item.track.preview_url}
        currentPlayingId={activeTrackId}
        isPlaying={isTrackPlaying}
        onPlayPress={() => handleTogglePlay(item.track.external_urls.spotify, item.track.preview_url)
        }
      </TrackItem>
    )
  }

  const handleTogglePlay = (id: string, url: string | null) => {
    if (!url) return;

    if (activeTrackId === id) {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
    } else {
      setActiveTrackId(id);
      player.replace(url);
      player.play();
    }
  }

  return (
    <View style={styles.container}>
      {playlist.images?.[0]?.url && (
        <View style={StyleSheet.absoluteFillObject}>
          {/* imagen estirada y borrosa*/}
          <Image
            source={{ uri: playlist.images?.[0]?.url }}
            style={[StyleSheet.absoluteFillObject, { opacity: 0.7 }]}
            blurRadius={40}
          />

          {/* parte baja oscura */}
          <LinearGradient
            colors={['transparent', '#121212']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
          />

          {/* capa negra más oscura */}
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
        </View>
      )}
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Image
            source={{ uri: playlist.images?.[0]?.url || '../assets/images/iconofaigrande.png' }}
            style={styles.playlistImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.headerTitle}>{playlist.name}</Text>
            <Text style={styles.playlistDescription}>{playlist.description}</Text>
          </View>
        </View>
        <FlatList
          data={playlist.tracks.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.track.external_urls.spotify}
          ListFooterComponent={loading ? <ActivityIndicator color="#1DB954" style={{ marginTop: 20 }} /> : null}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 15, }}
          extraData={[status.playing]}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 8,
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
  // ESTILOS CARD
  card: {
    flexDirection: "row",
    alignItems: 'center',
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
    alignContent: "space-around"
  },
  playlistName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  playlistDescription: {
    color: "#b3b3b3",
    fontSize: 12,
    marginTop: 2,
  },
  popularity: {
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
  playButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
  },
})

export default PlaylistScreen;