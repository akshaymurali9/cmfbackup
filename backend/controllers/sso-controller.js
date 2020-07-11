const router = require('express').Router()
const axios = require('axios')
const http = require('../helpers/http-helper')
const jwt = require("../helpers/jwt-helper")
const config = require('../configs/config')

router.get('', async function (request, response) {
    console.log('Reached sso controller')
    try {
        //execute the user detail api
        const username = request.user['id']
        backend_response = await http.execute_get(http.get_url(config.user_detail_api, username))
        response.send({
            access_token: jwt.generateAccessToken(username), 
            refresh_token: jwt.generateRefreshToken(username),
            user_detail : backend_response.data
        })
        console.log('done with sso')
    } catch (error) {
        response.status(error.status).json(error.get_message())
    }
})

router.get('/refreshtoken', function (request, response) {
    let accessToken = jwt.refreshToken(request, response)
    response.json({ 
        access_token: accessToken
    })
})

module.exports = router