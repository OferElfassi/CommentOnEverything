const {validationResult} = require("express-validator");
const HttpError = require("../utils/HttpError");

const checkValidationResult = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new HttpError('Validation failed', 422, errors.array());
    }

}

module.exports = checkValidationResult
