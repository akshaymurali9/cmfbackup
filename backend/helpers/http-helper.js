const ConnectionError = require('../helpers/errors').ConnectionError
const HttpErrorResponse = require('../helpers/errors').HttpErrorResponse
const axios = require('axios')

function get_default_headers() {
    return {
        'Content-Type': 'application/json'
    }
}

function get_url(base_url, path_param) {
    if(path_param != null) {
        if(!base_url.endsWith('/')) {
            base_url += '/'
        }
        base_url += path_param
    }
    return base_url
}

async function execute_get(url) {
    try {
        const headers = get_default_headers();
        let response = await axios.get(url, { headers })
        return response
    } catch(error) {
        if (error.response) {
            throw new HttpErrorResponse(error.response.status, error.response.data)
        } else if(error.request) {
            throw new ConnectionError('Could not connect to the endpoint url: ' + url)
        }
    }
}

module.exports = {
    get_default_headers: get_default_headers,
    get_url: get_url,
    execute_get: execute_get
}