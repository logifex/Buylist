import { firebase } from "../../config";
import { createTestUser, deleteTestUser } from "../utils/commonRequests";
import { dummyUserInputs } from "../utils/dummyInputs";
import listsDescribe from "./lists";
import participantsDescribe from "./participants";
import productsDescribe from "./products";

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
      } catch (err: any) {
        if (
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
      await deleteTestUser(user.id!);
      await firebase.auth().deleteUser(user.id!);
    }
  });

  describe("Lists", listsDescribe);
  describe("Products", productsDescribe);
  describe("Participants", participantsDescribe);
});
