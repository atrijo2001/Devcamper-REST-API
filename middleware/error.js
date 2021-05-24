const colors = require('colors');
const ErrorResponse = require('../utils/errorResponse')
const errorHandler = (err, req, res, next) => {
    let error = {...err}
    error.message = err.message
    //Log to the console for the developer
    console.log(err.stack.red)

    //Mongoose bad object id
    if(err.name === 'CastError'){
        const message = `Resourcenot found with an id of ${err.value}`;
        error = new ErrorResponse(message, 404)
    }

    //Mongoose Duplicate Key
    // if(err.code = 11000){
    //     const message = 'Duplicate Field value entered'
    //     error = new ErrorResponse(message, 400)
    // }

    //Validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "server error"
    })
}

module.exports = errorHandler