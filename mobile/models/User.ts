export interface UserDetails {
  id: string;
  name: string | null;
  photoUrl: string | null;
}

interface User extends UserDetails {
  email: string | null;
}

export default User;
