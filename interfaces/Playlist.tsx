// app/interfaces/Playlist.tsx

export interface Artist {
  name: string;
  external_urls: { spotify: string };
  genres?: string[]; 
}

export interface Album {
  name: string;
  release_date: string;
  images: Array<{ url: string; width: number; height: number }>;
  external_urls: { spotify: string };
}

export interface TrackPlayer {
  track: Track;
  previewUrl: string | null;
  currentPlayingId: string | null;
  isPlaying: boolean;
  onPlayPress: (id: string, url: string | null) => void;
}

export interface Track {
  name: string;
  artists: Artist[];
  album: Album;
  popularity: number;
  explicit: boolean;
  external_urls: { spotify: string };
}

export interface PlaylistTrackItem {
  track: Track;
  preview_url: string | null;
}

export interface Playlist {
  id: number;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  genres?: string[]; 
  tracks: {
    items: PlaylistTrackItem[];
  };
  isFavorite?: boolean;
}