const express = require('express');
const session = require('express-session');
const passport = require('passport');
//const APIStrategy = require('ibmcloud-appid').APIStrategy;
// const WebAppStrategy =  require('ibmcloud-appid').WebAppStrategy;
const parser = require("body-parser");
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const router = express.Router();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const app = express();
app.use(parser.json());
app.use(session({
    secret: '123456',
    resave: true,
    saveUnitinitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user,cb) => cb(null, user));

var headers = {};
//use the openid connect strategy
const OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
passport.use(new OpenIDConnectStrategy({
    authorizationURL : 'https://w3id.alpha.sso.ibm.com/isam/oidc/endpoint/amapp-runtime-oidcidp/authorize',
    tokenURL : 'https://w3id.alpha.sso.ibm.com/isam/oidc/endpoint/amapp-runtime-oidcidp/token',
    clientID : 'OWY1ZTcxMmMtMDAwZi00',
    scope: 'openid',
    response_type: 'code',
    clientSecret : 'MGEzZmZiMWQtNmZjMi00',
    callbackURL : '/auth/sso/callback',
    skipUserProfile: true,
    addCACert: true,
    CACertPathList: ['/certs/oidc_w3id_staging.cer'],
    issuer: 'https://w3id.alpha.sso.ibm.com/isam' }, 
    function(iss, sub, profile, accessToken, refreshToken, params, done)  {
        process.nextTick(function() {
            console.log("ACCESS TOKEN "+accessToken);
            headers = {
                'Authorization' : accessToken
            } 
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            done(null, profile);
        })
    })
);

//Handle Callback
//app.get('/appid/callback',passport.authenticate('openidconnect', {}));

//Handle logout
// app.get('/appid/logout', function(req, res){
//     WebAppStrategy.logout(req);
//     res.redirect('/');
// })

//Protect the whole webapp
app.use(passport.authenticate('openidconnect', {}));

//router for callback
app.get('/auth/sso/callback', function(request, response, next) {
    
    console.log("Entered Callback Function");
    axios.post('http://localhost:3005/users/login', {
        //"username": headers.Authorization
    },{headers: headers})
    .then((res) => {
        console.log("Response Body Id "+res.data.id +" Email :"+res.data.email+ " Roles "+ res.data.roles);
        console.log("Response Header "+res.headers.token);
        //response.status(200);
    })
    .catch((error) => {
        console.error(error)
        //response.status(500);
    })
    response.send('Callback Response');
});

// function performRequest(request,response, next ) {
    
//     console.log("Entered perform REquest Method");
//     //console.log('Authorization Header ##### '+headers.Authorization );
//     axios.post('http://localhost:3005/users/login', {
//         "username": headers.Authorization
//     })//,{headers: headers})
//     .then((res) => {
//     //console.log(`statusCode: ${res.statusCode}`)
//     console.log(res.data.token)
//         return response.status(200);
//     })
//     .catch((error) => {
//         console.error(error)
//         return response.status(500);
//     })
//   }

//Serve static resources
app.use (express.static('./public'));


//Start server
https.createServer({
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')}, app).listen(3000, () => {
    console.log('Server started at port 3000 in dev')
})