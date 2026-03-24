import { DeleteButton } from '@/components/delete-button';
import TrackItem from '@/components/TrackPlayer';
import { IP_ADDRESS } from '@/src/api';
import { styles } from "@/src/style/playlist-styles";
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
        previewUrl={item.preview_url}
        currentPlayingId={activeTrackId}
        isPlaying={isTrackPlaying}
        onPlayPress={() => handleTogglePlay(item.track.external_urls.spotify, item.preview_url)
        }>
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
          <DeleteButton id={id as string} />
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

export default PlaylistScreen;