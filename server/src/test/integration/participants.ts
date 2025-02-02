import request from "supertest";
import {
  createTestList,
  createTestInviteToken,
  getTestInviteToken,
  getTestJwt,
  getTestList,
  getTestParticipants,
  joinTestList,
} from "../utils/commonRequests";
import app from "../../app";
import { expect } from "chai";
import { FullList, ListPreview } from "../../types/list";
import { ParticipantDetails } from "../../types/participant";
import { dummyParticipants, dummyUserInputs } from "../utils/dummyInputs";
import Sinon, { SinonSandbox } from "sinon";
import { firebase } from "../../config";

const USER_AMOUNT = 3;

const participantsDescribe = () => {
  const jwts: string[] = [];

  before(async () => {
    for (let i = 0; i < USER_AMOUNT; i++) {
      jwts.push(await getTestJwt(dummyUserInputs[i].id!));
    }
  });

  describe("creating an invite token", () => {
    it("should create an invite token", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });

      const test = await request(app)
        .post(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(201);

      expect(new Date(test.body.expiry)).to.be.above(new Date());
      expect(test.body.token.length).to.equal(22);
    });

    it("should create an invite token as a basic user", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[1], list.id)).body.token;
      await joinTestList(jwts[0], token);
      await request(app)
        .delete(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[1], { type: "bearer" });

      const test = await request(app)
        .post(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(201);

      expect(new Date(test.body.expiry)).to.be.above(new Date());
      expect(test.body.token.length).to.equal(22);
    });

    it("should return 404 for creating an invite token for a non-existing list", async () => {
      const fakeId = "327e258e-0054-41fc-997d-87e16425e43b";
      const test = await request(app)
        .post(`/api/lists/${fakeId}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should return 404 for creating an invite token without being a participant", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });

      const test = await request(app)
        .post(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
      await getTestInviteToken(jwts[1], list.id).expect(404);
    });

    it("should return 409 for creating an invite token when it already exists", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });
      await createTestInviteToken(jwts[0], list.id);

      const test = await request(app)
        .post(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(409);

      expect(test.body.error.code).to.equal("INVITATION_ALREADY_EXISTS");
    });
  });

  describe("getting an invite token", () => {
    it("should get an invite token", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });
      const { body: invitation } = await createTestInviteToken(
        jwts[0],
        list.id
      );

      const test = await request(app)
        .get(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(200);

      expect(test.body).to.deep.equal(invitation);
    });

    it("should get an invite token as a basic user", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });
      const { body: invitation } = await createTestInviteToken(
        jwts[1],
        list.id
      );
      await joinTestList(jwts[0], invitation.token);

      const test = await request(app)
        .get(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(200);

      expect(test.body).to.deep.equal(invitation);
    });

    it("should return 404 for getting a non-existing invite token", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });

      const test = await request(app)
        .get(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("INVITATION_NOT_FOUND");
    });

    it("should return 404 for getting an invite token in a non-existing list", async () => {
      const fakeId = "327e258e-0054-41fc-997d-87e16425e43b";

      const test = await request(app)
        .get(`/api/lists/${fakeId}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should return 404 for getting an invite token without being a participant", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });
      await createTestInviteToken(jwts[1], list.id);

      const test = await request(app)
        .get(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
    });
  });

  describe("deleting an invite token", () => {
    it("should delete an invite token", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });
      await createTestInviteToken(jwts[0], list.id);

      const test = await request(app)
        .delete(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(204);

      expect(test.noContent).to.be.true;
      getTestInviteToken(jwts[0], list.id).expect(404);
    });

    it("should delete an invite token as a basic user", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[0], list.id)).body.token;
      await joinTestList(jwts[1], token);

      const test = await request(app)
        .delete(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[1], { type: "bearer" })
        .expect(204);

      expect(test.noContent).to.be.true;
    });

    it("should return 404 for deleting a non-existing invite token", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });

      const test = await request(app)
        .delete(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("INVITATION_NOT_FOUND");
    });

    it("should return 404 for deleting an invite token in a non-existing list", async () => {
      const fakeId = "327e258e-0054-41fc-997d-87e16425e43b";

      const test = await request(app)
        .delete(`/api/lists/${fakeId}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should return 404 for deleting an invite token without being a participant", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });
      await createTestInviteToken(jwts[1], list.id);

      const test = await request(app)
        .delete(`/api/lists/${list.id}/participants/invite/token`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
      await getTestInviteToken(jwts[1], list.id).expect(200);
    });
  });

  describe("getting an invitation list", () => {
    let sandbox: SinonSandbox;

    before(() => {
      sandbox = Sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should get an invitation list preview", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[1], list.id)).body.token;

      const test = await request(app)
        .get(`/api/lists/join/${token}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(200);

      const expected: ListPreview = { id: list.id, name: list.name };
      expect(test.body).to.deep.equal(expected);
    });

    it("should return 404 for getting a non-existing invitation list", async () => {
      const fakeToken = "eKtl9uuSThiv4AAArv0puQ";
      const test = await request(app)
        .get(`/api/lists/join/${fakeToken}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("INVITATION_NOT_FOUND");
    });

    it("should return 404 for getting an expired invitation list", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[1], list.id)).body.token;

      // to prevent the firebase auth token from being expired because of the fake timer
      const decodedToken = await firebase.auth().verifyIdToken(jwts[0]);
      sandbox.stub(firebase.auth(), "verifyIdToken").resolves(decodedToken);

      const clock = sandbox.useFakeTimers({
        now: Date.now(),
        toFake: ["Date"],
      });
      clock.tick(1000 * 60 * 60 * 24 * 3);

      const test = await request(app)
        .get(`/api/lists/join/${token}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("INVITATION_NOT_FOUND");
    });

    it("should return 400 for using an invalid invitation token for getting an invitation list", async () => {
      const invalidTokens = [
        "eKtl9uuSThiv4AAArv0pu", // too short
        "eKtl9uuSThiv4AAArv0puQ0", // too long
        "eKtl9uuSThiv$AAArv@puQ", // invalid characters
      ];

      for (const token of invalidTokens) {
        const test = await request(app)
          .get(`/api/lists/join/${token}`)
          .auth(jwts[0], { type: "bearer" })
          .expect(400);
        expect(test.body.error.code).to.equal("VALIDATION_ERROR");
        expect(test.body.error.data.length).to.equal(1);
        expect(test.body.error.data[0].path).to.deep.equal(["inviteToken"]);
      }
    });
  });

  describe("joining a list", () => {
    let sandbox: SinonSandbox;

    before(() => {
      sandbox = Sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should join a list", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[0], list.id)).body.token;

      const test = await request(app)
        .post(`/api/lists/join/${token}`)
        .auth(jwts[1], { type: "bearer" })
        .expect(201);

      const expected: FullList = {
        ...list,
        participants: [dummyParticipants[0], dummyParticipants[1]],
      };
      expect(test.body).to.deep.equal(expected);
    });

    it("should return 404 for joining a non-existing list invitation", async () => {
      const fakeToken = "eKtl9uuSThiv4AAArv0puQ";

      const test = await request(app)
        .post(`/api/lists/join/${fakeToken}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("INVITATION_NOT_FOUND");
    });

    it("should return 404 for joining an expired list invitation", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[1], list.id)).body.token;

      // to prevent the firebase auth token from being expired because of the fake timer
      const decodedToken = await firebase.auth().verifyIdToken(jwts[0]);
      sandbox.stub(firebase.auth(), "verifyIdToken").resolves(decodedToken);

      const clock = sandbox.useFakeTimers({
        now: Date.now(),
        toFake: ["Date"],
      });
      clock.tick(1000 * 60 * 60 * 24 * 3);

      const test = await request(app)
        .post(`/api/lists/join/${token}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("INVITATION_NOT_FOUND");

      await getTestList(jwts[0], list.id).expect(404);
    });

    it("should return 409 for joining a list when already a participant", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[1], list.id)).body.token;

      const ownerTest = await request(app)
        .post(`/api/lists/join/${token}`)
        .auth(jwts[1], { type: "bearer" })
        .expect(409);

      expect(ownerTest.body.error.code).to.equal("PARTICIPANT_ALREADY_EXISTS");

      await joinTestList(jwts[0], token);

      const basicTest = await request(app)
        .post(`/api/lists/join/${token}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(409);

      expect(basicTest.body.error.code).to.equal("PARTICIPANT_ALREADY_EXISTS");
    });

    it("should return 400 for using an invalid invitation token for joining a list", async () => {
      const invalidTokens = [
        "eKtl9uuSThiv4AAArv0pu", // too short
        "eKtl9uuSThiv4AAArv0puQ0", // too long
        "eKtl9uuSThiv$AAArv@puQ", // invalid characters
      ];

      for (const token of invalidTokens) {
        const test = await request(app)
          .post(`/api/lists/join/${token}`)
          .auth(jwts[0], { type: "bearer" })
          .expect(400);
        expect(test.body.error.code).to.equal("VALIDATION_ERROR");
        expect(test.body.error.data.length).to.equal(1);
        expect(test.body.error.data[0].path).to.deep.equal(["inviteToken"]);
      }
    });
  });

  describe("getting participants", () => {
    it("should get participants", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });

      const test = await request(app)
        .get(`/api/lists/${list.id}/participants`)
        .auth(jwts[0], { type: "bearer" })
        .expect(200);

      expect(test.body).to.deep.equal(list.participants);
    });

    it("should get many participants in order", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[0], list.id)).body.token;
      await joinTestList(jwts[1], token);
      await joinTestList(jwts[2], token);

      const test = await request(app)
        .get(`/api/lists/${list.id}/participants`)
        .auth(jwts[0], { type: "bearer" })
        .expect(200);

      expect(test.body).to.deep.equal(dummyParticipants);
    });

    it("should get participants as a basic user", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[0], list.id)).body.token;
      await joinTestList(jwts[1], token);
      await joinTestList(jwts[2], token);

      const test = await request(app)
        .get(`/api/lists/${list.id}/participants`)
        .auth(jwts[1], { type: "bearer" })
        .expect(200);

      expect(test.body).to.deep.equal(dummyParticipants);
    });

    it("should return 404 for getting participants in a non-existing list", async () => {
      const fakeId = "bbe3b80d-bf8a-40f6-aa87-d2d8bca82da1";

      const test = await request(app)
        .get(`/api/lists/${fakeId}/participants`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should return 404 for getting participants without being a participant", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });

      const test = await request(app)
        .get(`/api/lists/${list.id}/participants`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
    });
  });

  describe("removing a participant", () => {
    it("should remove a participant", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[0], list.id)).body.token;
      await joinTestList(jwts[1], token);
      await joinTestList(jwts[2], token);

      const test = await request(app)
        .delete(`/api/lists/${list.id}/participants/${dummyUserInputs[1].id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(204);

      expect(test.noContent).to.be.true;

      const actualParticipants: ParticipantDetails[] = (
        await getTestParticipants(jwts[0], list.id)
      ).body;
      expect(actualParticipants.length).to.equal(2);
      expect(
        actualParticipants.every((p) => p.user.id !== dummyUserInputs[1].id)
      ).to.be.true;
      expect(actualParticipants[0].role).to.equal("OWNER");

      await getTestList(jwts[1], list.id).expect(404);
    });

    it("should not remove owner", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });

      const test = await request(app)
        .delete(`/api/lists/${list.id}/participants/${dummyUserInputs[0].id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(403);

      expect(test.body.error.code).to.equal("REMOVE_OWNER_ERROR");

      const { body: actualParticipants } = await getTestParticipants(
        jwts[0],
        list.id
      );
      expect(actualParticipants).to.deep.equal(list.participants);
    });

    it("should remove participant as same participant as a basic user", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[1], list.id)).body.token;
      await joinTestList(jwts[0], token);

      const test = await request(app)
        .delete(`/api/lists/${list.id}/participants/${dummyUserInputs[0].id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(204);

      expect(test.noContent).to.be.true;
      const actualParticipants: ParticipantDetails[] = (
        await getTestParticipants(jwts[1], list.id)
      ).body;
      expect(
        actualParticipants.every((p) => p.user.id !== dummyUserInputs[0].id)
      ).to.be.true;

      await getTestList(jwts[0], list.id).expect(404);
    });

    it("should return 403 for removing another participant as a basic user", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[1], list.id)).body.token;
      await joinTestList(jwts[0], token);
      await joinTestList(jwts[2], token);

      const test = await request(app)
        .delete(`/api/lists/${list.id}/participants/${dummyUserInputs[2].id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(403);

      expect(test.body.error.code).to.equal("NOT_PERMITTED");

      const { body: actualParticipants } = await getTestParticipants(
        jwts[1],
        list.id
      );
      expect(actualParticipants.length).to.equal(3);
    });

    it("should return 403 for removing owner as a basic user", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[1], list.id)).body.token;
      await joinTestList(jwts[0], token);

      const test = await request(app)
        .delete(`/api/lists/${list.id}/participants/${dummyUserInputs[1].id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(403);

      expect(test.body.error.code).to.equal("NOT_PERMITTED");
    });

    it("should return 404 for removing a non-existing participant", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });

      const test = await request(app)
        .delete(`/api/lists/${list.id}/participants/${dummyUserInputs[1].id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("PARTICIPANT_NOT_FOUND");
    });

    it("should return 404 for removing a non-existing user", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list",
      });
      const fakeId = "d2fb724a-e996-4f11-936e-50fb25ede5ef";

      const test = await request(app)
        .delete(`/api/lists/${list.id}/participants/${fakeId}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("PARTICIPANT_NOT_FOUND");
    });

    it("should return 404 for removing a participant in a non-existing list", async () => {
      const fakeId = "d2fb724a-e996-4f11-936e-50fb25ede5ef";

      const test = await request(app)
        .delete(`/api/lists/${fakeId}/participants/${dummyUserInputs[0].id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should return 404 for removing a participant without being a participant", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list",
      });
      const token = (await createTestInviteToken(jwts[1], list.id)).body.token;
      await joinTestList(jwts[2], token);

      const basicTest = await request(app)
        .delete(`/api/lists/${list.id}/participants/${dummyUserInputs[2].id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(basicTest.body.error.code).to.equal("LIST_NOT_FOUND");

      const ownerTest = await request(app)
        .delete(`/api/lists/${list.id}/participants/${dummyUserInputs[1].id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      expect(ownerTest.body.error.code).to.equal("LIST_NOT_FOUND");

      const { body: actualParticipants } = await getTestParticipants(
        jwts[1],
        list.id
      );
      expect(actualParticipants.length).to.equal(2);
    });
  });
};

export default participantsDescribe;
