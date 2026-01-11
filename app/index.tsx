import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  ActivityIndicator
} from 'react-native';

import {
  SafeAreaView
} from 'react-native-safe-area-context';

import { Playlist } from './interfaces/Playlist';

const PlaylistsScreen = () => {  
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [ultimaID, setUltimaID] = useState(0);

  const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
  const PORT = "3000";
  const IP_ADDRESS = IP + ":" + PORT;

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`http://${IP_ADDRESS}/api/playlist/?from=${ultimaID}`);
      const data = await response.json();

      if (data && data.playlists) {
        setPlaylists(prev => {
          const nuevasUnicas = data.playlists.filter(
            (nueva:Playlist) => !prev.some(existente => existente.id === nueva.id)
          );
          return [...prev, ...nuevasUnicas];
        });
        
        setUltimaID(data.ultimaID);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const renderItem = ({ item }: { item: Playlist }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.images[0]?.url }} 
        style={styles.playlistImage} 
      />
      <View style={styles.textContainer}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.trackCount}>
          {item.tracks.items.length} canciones
        </Text>
      </View>
    </View>
  );

  return (
      <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Mis Playlists</Text>
      
      <FlatList
        data={playlists}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={fetchPlaylists} // paginación
        onEndReachedThreshold={0}
        ListFooterComponent={loading ? <ActivityIndicator color="#1DB954" /> : null}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 15 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', marginVertical: 20 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#1e1e1e', 
    borderRadius: 8, 
    marginBottom: 15, 
    overflow: 'hidden',
    elevation: 3
  },
  playlistImage: { width: 100, height: 100 },
  textContainer: { flex: 1, padding: 10, justifyContent: 'center' },
  playlistName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  playlistDescription: { color: '#b3b3b3', fontSize: 12, marginTop: 4 },
  trackCount: { color: '#1DB954', fontSize: 11, marginTop: 8, fontWeight: 'bold' }
});

export default PlaylistsScreen;