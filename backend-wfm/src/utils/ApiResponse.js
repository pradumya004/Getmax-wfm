// backend-wfm/src/utils/ApiResponse.js

class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.timestamp = new Date().toISOString();
    }

    // static success(data, message = "Success", statusCode = 200) {
    //     return new ApiResponse(statusCode, data, message);
    // }

    // static created(data, message = "Created successfully") {
    //     return new ApiResponse(201, data, message);
    // }

    // static noContent(message = "No content") {
    //     return new ApiResponse(204, null, message);
    // }
}

export { ApiResponse };