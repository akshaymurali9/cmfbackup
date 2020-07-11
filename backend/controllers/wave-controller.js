const router = require('express').Router()
const config = require('../configs/config')
const http = require('../helpers/http-helper')

//api for returning the list of the waves
router.get('', async function (request, response) {
    try {
        //execute the user detail api
        backend_response = await http.execute_get(config.wave_list_api)
        response.send(backend_response.data)
    } catch (error) {
        response.status(error.status).json(error.message);
    } 
})

//api for returning the summary of the waves
router.get('/summary', async function (request, response) {
    try {
        //execute the user detail api
        backend_response = await http.execute_get(config.wave_summary_api)
        response.send(backend_response.data)
    } catch (error) {
        response.status(error.status).json(error.message)
    }
})

module.exports = router