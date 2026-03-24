import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';

// 1. Definimos el "contrato" o estructura de nuestro contexto
type FavoritesContextType = {
  favoriteIds: number[]; // Un arreglo de números (los IDs de las playlists)
  toggleFavorite: (playlistId: number) => Promise<void>; // Una función asíncrona que recibe un ID
};

// 2. Creamos el contexto con valores por defecto vacíos
export const FavoritesContext = createContext<FavoritesContextType>({
  favoriteIds: [],
  toggleFavorite: async () => {}, // Función vacía por defecto
});

// 3. Creamos el Provider
export const FavoritesProvider = ({ children }: PropsWithChildren) => {
  // Estado local fuertemente tipado como arreglo de números
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // (Opcional) Cargar los favoritos iniciales de tu backend al arrancar
  useEffect(() => {
    const fetchInitialFavorites = async () => {
      try {
        const userId = 1; // Aquí irá tu usuario real
        const response = await fetch(`http://tu-api.com/playlists/favorites/ids?userId=${userId}`);
        const data: number[] = await response.json(); // Le decimos a TS que esperamos un array de números
        setFavoriteIds(data);
      } catch (error) {
        console.error("Error al cargar favoritos", error);
      }
    };
    fetchInitialFavorites();
  }, []);

  // La función principal que usarán tus componentes
  const toggleFavorite = async (playlistId: number) => {
    const isAlreadyFav = favoriteIds.includes(playlistId);

    // Actualización Optimista (UI instantánea)
    if (isAlreadyFav) {
      setFavoriteIds(prev => prev.filter(id => id !== playlistId));
    } else {
      setFavoriteIds(prev => [...prev, playlistId]);
    }

    // Llamada al backend
    try {
      const response = await fetch('http://tu-api.com/playlists/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idPlaylist: playlistId,
          isFavorite: !isAlreadyFav
        }),
      });

      if (!response.ok) throw new Error('Error guardando en BD');

    } catch (error) {
      // Revertimos si falla
      if (isAlreadyFav) {
        setFavoriteIds(prev => [...prev, playlistId]);
      } else {
        setFavoriteIds(prev => prev.filter(id => id !== playlistId));
      }
      console.error(error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};