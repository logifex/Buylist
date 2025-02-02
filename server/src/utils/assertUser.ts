import { RequestUser } from "../types/user";

const assertUser = (user?: RequestUser): RequestUser => {
  if (!user) {
    throw new Error("No user found unexpectedly");
  }

  return user;
};

export default assertUser;
