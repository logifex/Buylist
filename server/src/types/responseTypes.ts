export interface ErrorResponse {
  error: {
    code?: string;
    message: string;
    data: unknown;
  };
}
