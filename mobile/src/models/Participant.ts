import { UserDetails } from "./User";

type Role = "OWNER" | "BASIC";

export interface Participant {
  role: Role;
  user: UserDetails;
}
