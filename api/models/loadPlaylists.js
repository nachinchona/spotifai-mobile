const path = require('path');
const fs = require('fs');

function cargarPlaylists() {
    const rutaJsons = path.join(__dirname, '../public/playlists');
    const files = fs.readdirSync(rutaJsons);
    console.log(files);
    return files.map(file => {
        const filePath = path.join(rutaJsons, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    });
}

// en realidad lo mueve de carpeta
function eliminarPlaylist(id) {
    const source = path.join(__dirname, `../public/playlists/playlist-${id}.json`);
    const destination = path.join(__dirname, `../public/ignored/playlist-${id}.json`);

    console.log('playlist en modelo ' + id);
    fs.renameSync(source, destination);
}

function modificarFavorito(id, isFavorite) {
    const filePath = path.join(__dirname, `../public/playlists/playlist-${id}.json`);

    try {
        // 1. Leemos el archivo actual
        const content = fs.readFileSync(filePath, 'utf-8');
        const playlist = JSON.parse(content);
        
        // 2. Le agregamos o modificamos la propiedad
        playlist.isFavorite = isFavorite;
        
        // 3. Volvemos a escribir el archivo con el nuevo dato
        fs.writeFileSync(filePath, JSON.stringify(playlist, null, 2), 'utf-8');

        console.log(`Playlist ${id} actualizada. isFavorite: ${isFavorite}`);
        return playlist; 

    } catch (error) {
        console.error(`Error al modificar la playlist ${id}:`, error);
        throw new Error('No se pudo modificar el archivo de la playlist');
    }
}

module.exports = { cargarPlaylists, eliminarPlaylist, modificarFavorito };