export interface UserDetails {
  id: string;
  name: string;
  photoUrl: string | null;
}

export interface User extends UserDetails {
  email: string;
}
