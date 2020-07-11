const router = require("express").Router()
const jwt = require("../helpers/jwt-helper")

router.post('/login', function (request, response) {
    const { username, password } = request.body
    console.log("login for " + username)

    //always return 200 for now
    response.json({ 
        access_token: jwt.generateAccessToken(username), 
        refresh_token: jwt.generateRefreshToken(username)
    }) 
})

router.post('/refreshtoken', function (request, response) {
    let accessToken = jwt.refreshToken(request, response)
    response.json({ 
        access_token: accessToken
    })
})

module.exports = router