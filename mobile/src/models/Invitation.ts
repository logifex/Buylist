export interface TokenResponse {
  token: string;
  expiry: string;
}

export interface TokenInvitation {
  token: string;
  expiry: Date;
}
