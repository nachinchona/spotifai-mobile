import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { TrackPlayer } from '../interfaces/Playlist';

const TrackItem = ({ track, previewUrl, currentPlayingId, isPlaying, onPlayPress }: TrackPlayer) => {
  const isThisTrackActive = track.external_urls.spotify === currentPlayingId;
  const id = track.external_urls.spotify;

  return (
    <View style={styles.card}>
        <Image
        source={{ uri: track.album.images?.[0]?.url || '../assets/images/iconofaigrande.png' }} 
        style={styles.playlistImage}>
        </Image>
        <View style={styles.textContainer}>
            <Text style={styles.playlistName}>{track.name}</Text>
            <Text style={styles.popularity}>{track.popularity}% de popularidad</Text>
        </View>
        <Pressable style={styles.playButtonContainer} onPress={() => onPlayPress(id, previewUrl)}>
        {previewUrl ? (
          <Ionicons 
            name={isThisTrackActive && isPlaying ? "pause" : "play"} 
            size={32} 
            color={isThisTrackActive ? "#1DB954" : "gray"} // Verde si está activa
          />
        ) : (
          <Ionicons name="play-outline" size={32} color="#333" /> // Icono deshabilitado si no hay preview
        )}
        </Pressable>
    </View>
  );
};

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

export default TrackItem;