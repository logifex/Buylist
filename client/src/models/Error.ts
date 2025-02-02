export interface BackendError {
  code?: string;
  message: string;
  data: unknown;
};

export class ApiError extends Error {
  status: number;
  error?: BackendError;

  constructor(message: string, status: number, error?: BackendError) {
    super(message);
    this.status = status;
    this.error = error;
  }
}
