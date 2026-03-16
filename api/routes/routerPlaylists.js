const express = require('express');
const routerPlaylists = express.Router();
const { editarPlaylist, obtenerPlaylistPorID, obtenerPlaylistsPaginadas, eliminarPlaylistPorID, actualizarPreviews } = require('../controllers/controllerPlaylists');

routerPlaylists
    // Añade previewUrls a todas las canciones posibles con spotify-preview-finder
    // Spotify API descontinuó esa funcionalidad en Nov de 2024
    .post('/refresh', actualizarPreviews)

    // Obtiene 3 playlists para realizar la paginación (a través de un botón 'Cargar más' se envían las faltantes)
    .get('/', obtenerPlaylistsPaginadas)

    // Edita playlist a través del body
    // Primero busca por idPlaylist y luego reemplaza su respectiva playlist por 
    .put('/:idPlaylist', editarPlaylist)

    // Obtiene playlist determinada por parámetro id
    .get('/:idPlaylist', obtenerPlaylistPorID)

    // "Elimina" una playlist, moviéndola de carpeta
    .delete('/:idPlaylist', eliminarPlaylistPorID)
    
module.exports = routerPlaylists;