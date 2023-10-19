import { HttpStatusCode } from '../enums/HttpStatusCode';

class ApiError extends Error {
  public httpCode: HttpStatusCode;

  constructor(message: string, httpCode: HttpStatusCode) {
    super(message);
    this.httpCode = httpCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
  
}

export { ApiError };
