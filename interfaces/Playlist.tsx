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

export interface Track {
  name: string;
  artists: Artist[];
  album: Album;
  preview_url: string | null;
  popularity: number;
  explicit: boolean;
  external_urls: { spotify: string };
}

export interface PlaylistTrackItem {
  track: Track;
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
}