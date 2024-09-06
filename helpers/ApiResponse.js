class ApiResponse{
    constructor(
        statusCode,
        data,
        message = "Something Went Wrong!"
    ){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}

export default ApiResponse;