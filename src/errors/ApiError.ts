import { HttpStatusCode } from "../enums/HttpStatusCode";

class ApiError extends Error {
    private httpCode: HttpStatusCode;

    constructor(message: string, httpCode: HttpStatusCode) {
        super(message);
        this.httpCode = httpCode;
        // Error.captureStackTrace(this);
    }
}

export { ApiError };