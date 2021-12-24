class HttpError extends Error {
    constructor(message, statusCode,errorData = null) {
        super(message);
        this.statusCode = statusCode;
        this.data = errorData
    }
}
module.exports = HttpError;
