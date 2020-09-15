const app = require('express')()
const consign = require('consign')

consign()
    .then('./config/middlewares.js')
    .then('./service')
    .then('./config/routes.js')
    .into(app)

app.listen(3000, () => {
    console.log("BackEnd executando...")
})