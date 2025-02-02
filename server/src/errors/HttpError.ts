class HttpError extends Error {
  message: string;
  status: number;
  code?: string;
  data: any;

  constructor(status: number, message: string = "") {
    super(message);
    this.name = "HttpError";
    this.message = message;
    this.status = status;
  }
}

export default HttpError;
