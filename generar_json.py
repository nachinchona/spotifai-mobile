import requests
import json
import os
import re
from pathlib import Path
from dotenv import load_dotenv
import requests

# --- CONFIGURACIÓN ---
load_dotenv()
SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
IP_ADDRESS = os.getenv('EXPO_PUBLIC_IP_ADDRESS')
PLAYLIST_ID = '4t2eOTOZsNbSVB2Hdhm9yE' # Ejemplo: '37i9dQZF1DXcBWIGoYBM5M'
FOLDER_PATH = './api/public/json/'

def get_next_playlist_id():
    folder = Path(FOLDER_PATH)
    
    # 1. Ensure the folder exists, otherwise count is 0
    if not folder.exists():
        return 1
    
    # 2. Count only files (ignoring subdirectories)
    # Using .glob('*') gets everything, .is_file() filters them
    files = [f for f in folder.iterdir() if f.is_file()]
    
    # Return the count + 1 for the new ID
    return len(files) + 1

def obtener_token(client_id, client_secret):
    auth_url = "https://accounts.spotify.com/api/token"
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    data = {
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret
    }
    response = requests.post(auth_url, headers=headers, data=data)
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        print("[ERROR] Error de autenticacion. Revisa Client ID y Secret.")
        return None

def generar_json_estricto(playlist_id, token):
    headers = {"Authorization": f"Bearer {token}"}
    
    print(f"[INFO] Descargando datos de la playlist {playlist_id}...")
    url_playlist = f"https://api.spotify.com/v1/playlists/{playlist_id}"
    resp = requests.get(url_playlist, headers=headers)
    
    if resp.status_code != 200:
        print(f"[ERROR] Codigo de estado: {resp.status_code}")
        return None
    
    raw_data = resp.json()
    artist_ids = set()
    raw_tracks = raw_data.get('tracks', {}).get('items', [])
    
    for item in raw_tracks:
        if item.get('track'):
            for artist in item['track']['artists']:
                if 'id' in artist:
                    artist_ids.add(artist['id'])
   
    print(f"[INFO] Analizando generos de {len(artist_ids)} artistas...")
    genres_set = set()
    artist_ids_list = list(artist_ids)
    
    for i in range(0, len(artist_ids_list), 50):
        chunk = artist_ids_list[i:i+50]
        ids_string = ",".join(chunk)
        url_artists = f"https://api.spotify.com/v1/artists?ids={ids_string}"
        
        resp_art = requests.get(url_artists, headers=headers)
        if resp_art.status_code == 200:
            for art in resp_art.json()['artists']:
                if art and 'genres' in art:
                    for g in art['genres']:
                        genres_set.add(g)
                        
    sorted_genres = sorted(list(genres_set))

    clean_items = []
    
    for item in raw_tracks:
        if not item.get('track'): continue
        
        t = item['track']
       
        clean_artists = []
        for art in t['artists']:
            spotify_url = art.get("external_urls", {}).get("spotify")
            clean_artists.append({
                "name": art.get("name"),
                "url": spotify_url 
            })
        
        clean_album = {
            "external_urls": t['album'].get("external_urls"),
            "name": t['album'].get("name"),
            "release_date": t['album'].get("release_date"),
            "images": t['album'].get("images")
        }
       
        track_obj = {
            "track": {
                "artists": clean_artists,
                "album": clean_album,
                "name": t.get("name"),
                "popularity": t.get("popularity"),
                "external_urls": t.get("external_urls"),
                "explicit": t.get("explicit")
            }
        }
        
        clean_items.append(track_obj)

    new_id = get_next_playlist_id()
    
    try:
       response = requests.post(
            f"http://{IP_ADDRESS+":3000"}/api/playlist/refresh",
            json={'tracks': clean_items},
            timeout=120
        )
    except requests.exceptions.Timeout:
        print("Error: La API de Node tardó demasiado en responder.")

    items_with_audio = response.json()['items']

    final_output = {
        "id": new_id,
        "name": raw_data['name'],
        "description": raw_data['description'],
        "genres": sorted_genres,
        "images": raw_data['images'],
        "tracks": {
            "items": items_with_audio
        }
    }
    
    return final_output

def slugify_filename(text):
    text = text.lower()
    # [^\w\s-] matches anything that is NOT a word character, space, or hyphen
    text = re.sub(r'[^\w\s-]', '', text)
    # Replace whitespace with a single hyphen
    return re.sub(r'[-\s]+', '-', text).strip('-')

if __name__ == "__main__":
    if SPOTIFY_CLIENT_ID is None:
        print("[ALERTA] Edita el archivo y coloca tu CLIENT_ID y CLIENT_SECRET.")
    else:
        token = obtener_token(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
        if token:
            datos = generar_json_estricto(PLAYLIST_ID, token)
            nombre_playlist = slugify_filename(datos["name"])+'.json'
            ruta_final = FOLDER_PATH + nombre_playlist
            if datos:
                try:
                    with open(ruta_final , 'w', encoding='utf-8') as f:
                        json.dump(datos, f, indent=4, ensure_ascii=False)
                    print(f"[EXITO] Archivo generado correctamente: {nombre_playlist}")
                except Exception as e:
                    print(f"[ERROR] No se pudo guardar el archivo: {e}")