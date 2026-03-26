import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';

type FavoritesContextType = {
  favoriteIds: number[];
  toggleFavorite: (playlistId: number) => Promise<void>;
};

export const FavoritesContext = createContext<FavoritesContextType>({
  favoriteIds: [],
  toggleFavorite: async () => {},
});

export const FavoritesProvider = ({ children }: PropsWithChildren) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchInitialFavorites = async () => {
      try {
        const userId = 1;
        const response = await fetch(`http://tu-api.com/playlists/favorites/ids?userId=${userId}`);
        const data: number[] = await response.json();
        setFavoriteIds(data);
      } catch (error) {
        console.error("Error al cargar favoritos", error);
      }
    };
    fetchInitialFavorites();
  }, []);

  const toggleFavorite = async (playlistId: number) => {
    const isAlreadyFav = favoriteIds.includes(playlistId);

    if (isAlreadyFav) {
      setFavoriteIds(prev => prev.filter(id => id !== playlistId));
    } else {
      setFavoriteIds(prev => [...prev, playlistId]);
    }

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