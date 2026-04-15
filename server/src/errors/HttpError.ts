class HttpError extends Error {
  message: string;
  status: number;
  code?: string;
  data: unknown;

  constructor(status: number, message = "") {
    super(message);
    this.name = "HttpError";
    this.message = message;
    this.status = status;
  }
}

export default HttpError;
