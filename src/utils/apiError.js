class APIError extends Error{
    constructor(
        message = "Something went wrong",
        statusCode,
        errors = [],
    ){
        super(message)
        // super(error)
        this.statusCode = statusCode,
        this.errors = errors.length ? errors : [message]
        // this.success = false
        this.data = null
    }
}

module.exports = APIError;