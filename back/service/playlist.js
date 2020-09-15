const request = require('request');

module.exports = app => {

    const getPlaylist = async(req, res) => {
        const cidade = {...req.body }
        const token = req.headers.authorization

        try {
            const graus = await getTemperatura(cidade)
            const category = await getCategory(graus)

            var options = {
                url: `https://api.spotify.com/v1/browse/categories/${category}/playlists`,
                headers: { 'Authorization': token },
                json: true
            };

            request(options, async(err, response, body) => {

                const id = await body.playlists.items[0].id;


                var option = {
                    url: `https://api.spotify.com/v1/playlists/${id}/tracks`,
                    headers: { 'Authorization': token },
                    json: true
                }
                request(option, async(err, response, body) => {
                    res.send(body.items)

                })
            })

        } catch (error) {
            res.sendStatus(500)
        }

    }

    const getTemperatura = cidade => new Promise(async(resolve, reject) => {

        if (cidade.nome) {
            var optionsTemp = {
                url: `https://api.openweathermap.org/data/2.5/weather?q=${cidade.nome}&appid=fb59cb5040211b63f6b223aa6fb62883&units=metric`,
                json: true
            }
        } else if (cidade.lat && cidade.lon) {
            var optionsTemp = {
                url: `https://api.openweathermap.org/data/2.5/weather?lat=${cidade.lat}&lon=${cidade.lon}&appid=fb59cb5040211b63f6b223aa6fb62883&units=metric`,
                json: true
            }
        }

        request(optionsTemp, (err, response, body) => {
            if (body.cod == '200') {
                const temperatura = body.main.temp
                resolve(temperatura)
            } else if (body.cod == '404')
                reject(500)
        })
    })

    const getCategory = graus => new Promise(async(resolve, reject) => {
        let category

        if (graus > 30) {
            category = 'party'
        } else if (graus >= 15 && graus <= 30) {
            category = 'pop'
        } else if (graus >= 10 && graus <= 14) {
            category = 'rock'
        } else {
            category = 'classical'
        }
        resolve(category)
    })

    return { getPlaylist }

}