import { UserDetails } from "./User";

type Role = "OWNER" | "BASIC";

interface Participant {
  role: Role;
  user: UserDetails;
}

export default Participant;
