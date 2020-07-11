class GenericError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}

class ConnectionError extends GenericError {
    constructor(message) {
        super(500, message)
    }   
}

class HttpErrorResponse extends Error {
    constructor(status, message) {
        super(status, message)
    }
}

module.exports = {
    ConnectionError : ConnectionError,
    HttpErrorResponse: HttpErrorResponse
}