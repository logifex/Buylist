import { firebase, pubClient } from "../../config/index.js";
import { createTestUser, deleteTestUser } from "../utils/commonRequests.js";
import { dummyUserInputs } from "../utils/dummyInputs.js";
import listsDescribe from "./lists.js";
import participantsDescribe from "./participants.js";
import productsDescribe from "./products.js";

describe("Integration", () => {
  before(async () => {
    for (const user of dummyUserInputs) {
      try {
        await firebase.auth().createUser({
          uid: user.id,
          email: user.email,
          displayName: user.name,
          photoURL: user.photoUrl ?? undefined,
        });
      } catch (err: unknown) {
        if (
          typeof err !== "object" ||
          err === null ||
          !("code" in err) ||
          typeof err.code !== "string" ||
          err.code !== "auth/uid-already-exists"
        ) {
          throw err;
        }
      }
      await createTestUser(user);
    }
  });

  after(async () => {
    for (const user of dummyUserInputs) {
      await deleteTestUser(user.id);
      await pubClient.del(`deletedUser:${user.id}`);
    }
  });

  describe("Lists", listsDescribe);
  describe("Products", productsDescribe);
  describe("Participants", participantsDescribe);
});
