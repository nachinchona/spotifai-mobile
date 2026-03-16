const path = require('path');
const fs = require('fs');

function cargarPlaylists() {
    const rutaJsons = path.join(__dirname, '../public/playlists');
    const files = fs.readdirSync(rutaJsons);
    console.log(files)
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

module.exports = { cargarPlaylists, eliminarPlaylist };