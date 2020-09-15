module.exports = app => {

    app.post('/playlist', app.service.playlist.getPlaylist)


}