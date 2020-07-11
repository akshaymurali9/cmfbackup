const jwt = require('jsonwebtoken')

const ACCESS_TOKEN_SECRET = "ThisaccesstokensecretdefinitelyneedstobeChanged"
const ACCESS_TOKEN_EXPIRES_IN = '24h'

const REFRESH_TOKEN_SECRET = "ThisrefreshtokensecretdefinitelyneedstobeChanged"
const REFRESH_TOKEN_EXPIRES_IN = '24h'

function generateAccessToken(intranet_id) {
    return jwt.sign(
        getJwtPayload(intranet_id), 
        ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN
        }
    )
}

function generateRefreshToken(intranet_id) {
    return jwt.sign(
        getJwtPayload(intranet_id), 
        REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN
        }
    )
}

function getJwtPayload(intranet_id) {
    return {
        intranet_id: intranet_id
    }
}

function refreshToken(request, response) {
    let refreshToken = request.headers['authorization']
    if (refreshToken != null) {
        if (refreshToken.startsWith('Bearer ')) {
            try {
                let tokens = refreshToken.split(' ')
                let payload = jwt.verify(tokens[1], REFRESH_TOKEN_SECRET)
                return jwt.sign(
                    getJwtPayload(payload.intranet_id), 
                    ACCESS_TOKEN_SECRET, {
                        expiresIn: ACCESS_TOKEN_EXPIRES_IN
                    }
                )
            } catch (error) {
                console.error(error)
                if (error instanceof jwt.JsonWebTokenError) {
                    response.status(403).send({ message: "Refresh token has expired"})
                }
                response.status(403).send(error)
            }            
        } else {
            response.status(403).send({ message: "Header: 'Authorization' should start with 'Bearer <token>'"})
        }
    } else {
        response.status(403).send({ message: 'Header: Authorization is missing in the request'})
    }
}

function verifyAccessToken(request, response, next) {
    let authToken = request.headers['authorization']
    if (authToken != null) {
        if (authToken.startsWith('Bearer ')) {
            try {
                let tokens = authToken.split(' ')
                jwt.verify(tokens[1], ACCESS_TOKEN_SECRET)
                response.locals.user = jwt.decode(tokens[1]).intranet_id
                next();
            } catch (error) {
                console.error('i am here..: ' + error)
                if (error instanceof jwt.JsonWebTokenError) {
                    response.status(403).send({ message: "Access token is expired"})
                } else {
                    response.status(403).send(error)
                }                
            }            
        } else {
            response.status(403).send({ message: "Header: 'Authorization' should start with 'Bearer <token>'"})
        }
    } else {
        response.status(403).send({ message: 'Header: Authorization is missing in the request'})
    }    
}

module.exports = {
    generateAccessToken: generateAccessToken,
    generateRefreshToken: generateRefreshToken,
    verifyAccessToken: verifyAccessToken,
    refreshToken: refreshToken
}