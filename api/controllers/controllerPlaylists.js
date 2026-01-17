require('dotenv').config();
const { loadPlaylists, writePlaylist } = require('../models/loadPlaylists');

const crearPlaylist = (req, res) => {
    const { id, name, description } = req.body;
    const json = JSON.stringify({ id, name, description });

    if (typeof id === "string" && id > 0) {
        return res.status(400).json({ message: 'Id invalida' });
    }

    const variasPlaylists = loadPlaylists();
    for (let playlist of variasPlaylists) {
        if (playlist.id == id) {
            return res.status(400).json({ message: 'Id ya existente' });
        }
    }

    writePlaylist(`playlist-${id}.json`, json);
    res.json({ message: 'Playlist creada correctamente!', data: { id, name, description } });

};

const editarPlaylist = (req, res) => {
    const idPlaylist = parseInt(req.params.idPlaylist);
    const { name, description } = req.body;
    const playlists = loadPlaylists();
    const playlistIndex = playlists.findIndex(p => p.id === idPlaylist);

    if (!idPlaylist) {
        return res.status(400).json({ message: 'Id no especificada' });
    }

    if (playlistIndex == -1) {
        return res.status(404).json({ message: 'No se encontró la playlist' });
    }

    if (typeof name !== "string" && idPlaylist < 1) {
        return res.status(400).json({ message: 'Nombre Invalido' });
    }

    if (typeof description !== "string") {
        return res.status(400).json({ message: 'Descripcion Invalida' });
    }

    if (name) playlists[playlistIndex].name = name;
    if (description) playlists[playlistIndex].description = description;

    const updatedPlaylist = playlists[playlistIndex];
    const rutaJsons = path.join(__dirname, '/public/json');
    const filePath = path.join(rutaJsons, `playlist-${updatedPlaylist.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(updatedPlaylist, null, 2), 'utf-8');
    res.json({ message: 'Playlist actualizada correctamente!', playlist: updatedPlaylist });
};

const obtenerPlaylistPorID = (req, res) => {
    const idPlaylist = parseInt(req.params.idPlaylist);
    const playlists = loadPlaylists();
    const playlistIndex = playlists.findIndex(p => parseInt(p.id) === idPlaylist);

    if (!idPlaylist) {
        return res.status(400).json({ message: 'Id no especificada' });
    }

    if (playlistIndex == -1) {
        return res.status(404).json({ message: 'No se encontró la playlist' });
    }
    
    res.json({ message: 'Playlist obtenida!', playlist: playlists[playlistIndex] });
};

const obtenerPlaylistsPaginadas = (req, res) => {
    const from = parseInt(req.query.from);
    const paginacion = 10;

    if (isNaN(from)) {
        return res.status(400).json({ message: 'Parámetro "from" debe ser un número' });
    }

    const playlists = loadPlaylists();
    playlists.sort((a, b) => a.id - b.id);
    const candidatas = playlists.filter(p => p.id > from);
    const corte = candidatas.slice(0, paginacion);

    if (corte.length === 0) {
        return res.status(404).json({ message: 'No hay más playlists' });
    }

    const ultimaID = corte[corte.length - 1].id;

    const hayMas = candidatas.length > paginacion;

    res.json({ 
        message: 'Playlists obtenidas!', 
        playlists: corte, 
        ultimaID: ultimaID,
        hayMas: hayMas
    });
};

const getPreview = require('spotify-preview-finder');

const refreshPreviewUrls = async (req, res) => {
    try {
        const { tracks } = req.body;
        const enrichedTracks = [];

        for (const track of tracks) {
            try {
                const name = track.track.name;
                const artist = track.track.artists[0].name;
                const result = await getPreview(`${name}`, `${artist}`, 2);
                if (result.success && result.results.length > 0 && result.results[0].previewUrls.length > 0) {
                    const previewUrl = result.results[0].previewUrls[0];
                    enrichedTracks.push({
                        track: track.track, preview_url: previewUrl 
                    });
                }
            } catch (err) {
                console.log("Resultado de la librería:", JSON.stringify(result, null, 2));
            }
        }

        res.json({ items: enrichedTracks });
    } catch (error) {
        res.status(500).json({ error: "Error actualizando la playlist" });
    }
};

module.exports = { crearPlaylist, editarPlaylist, obtenerPlaylistPorID, obtenerPlaylistsPaginadas, refreshPreviewUrls };