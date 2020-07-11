const dotenv = require('dotenv')

//load config file
const result = dotenv.config()
if(result.error) {
    console.error('.env file does not exists. using environment variables set, if any')
}

module.exports = {
    environment: process.env.environment,
    sso : {
        client_id : 'OWY1ZTcxMmMtMDAwZi00',
        client_secret : 'MGEzZmZiMWQtNmZjMi00',
        authorization_url : 'https://w3id.alpha.sso.ibm.com/isam/oidc/endpoint/amapp-runtime-oidcidp/authorize',
        token_url : 'https://w3id.alpha.sso.ibm.com/isam/oidc/endpoint/amapp-runtime-oidcidp/token',
        issuer_id : 'https://w3id.alpha.sso.ibm.com/isam',
        callback_url : 'https://localhost:3000/auth/sso/callback'
    },
    user_detail_api: (process.env.backend_url || 'http://localhost:3000') + '/users',
    wave_list_api: (process.env.backend_url || 'http://localhost:3000') + '/waves',
    wave_summary_api: (process.env.backend_url || 'http://localhost:3000') + '/waves/summary'
}