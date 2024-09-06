class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something Went Wrong!",
        errors = [],
    ){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null;
        this.success = false;
    }
}

export default ApiError;