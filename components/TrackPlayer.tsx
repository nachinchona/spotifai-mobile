import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { TrackPlayer } from '../interfaces/Playlist';

const TrackItem = ({ track, previewUrl, currentPlayingId, isPlaying, onPlayPress }: TrackPlayer) => {
  const isThisTrackActive = track.external_urls.spotify === currentPlayingId;
  const id = track.external_urls.spotify;

  // if (isPlaying) console.log(`Track: ${track.name} | Active: ${isThisTrackActive} | Playing: ${isPlaying}`);
  return (
    <View style={styles.card}>
        <Image
        source={{ uri: track.album.images?.[0]?.url || '../assets/images/iconofaigrande.png' }} 
        style={styles.songImage}>
        </Image>
        <View style={styles.textContainer}>
            <Text style={styles.songName}>{track.name}</Text>
            <Text style={styles.artistName}>{track.artists[0].name}</Text>
            <Text style={styles.popularity}>{track.popularity}% de popularidad</Text>
        </View>
        <Pressable style={styles.playButtonContainer} onPress={() => onPlayPress(id, previewUrl)}>
        {previewUrl ? (
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={32} 
            color={isThisTrackActive ? "#1DB954" : "gray"}
          />
        ) : (
          <Ionicons name="play-outline" size={32} color="#333" />
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
  // ESTILOS CARD
  card: {
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: "#1e1e1eff",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
  },
  songImage: {
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
  songName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  artistName: {
    color: "#777",
    fontSize: 12,
    fontWeight: "bold",
  },
  popularity: {
    color: "#777",
    fontSize: 8,
    marginTop: 6,
  },
  playButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
  },
})

export default TrackItem;