class APIResponse {
    constructor(
        statusCode,
        data ,
        message = "Success"
    ){
        this.statusCode = statusCode < 400,
        this.data = data,
        this.message = message
    }
}

module.exports = APIResponse;