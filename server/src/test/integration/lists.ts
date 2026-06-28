import type {
  CreateListInput,
  EditListInput,
  FullList,
  ListDetails,
} from "../../types/list.js";
import type { TokenInvitationDetails } from "../../types/invitation.js";
import type { ErrorResponse } from "../../types/responseTypes.js";
import { describe, it } from "mocha";
import request from "supertest";
import { expect } from "chai";
import app from "../../app.js";
import {
  invalidListCreateTestCases,
  invalidListTestCases,
  invalidListUpdateTestCases,
  invalidProductCreateTestCases,
  invalidProductTestCases,
} from "../utils/testCases.js";
import {
  basicTestList,
  dummyParticipants,
  dummyUserInputs,
} from "../utils/dummyInputs.js";
import {
  createTestList,
  createTestInviteToken,
  getTestJwt,
  getTestList,
  joinTestList,
} from "../utils/commonRequests.js";
import { ListService } from "../../services/index.js";
import { resourceLimits } from "../../config/index.js";

const USER_AMOUNT = 3;

const listsDescribe = () => {
  const jwts: string[] = [];

  before(async () => {
    for (let i = 0; i < USER_AMOUNT; i++) {
      jwts.push(await getTestJwt(dummyUserInputs[i].id));
      await ListService.deleteAllUserLists(dummyUserInputs[i].id);
    }
  });

  describe("creating a list", () => {
    it("should create a basic list", async () => {
      const test = await request(app)
        .post("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .send({ name: basicTestList.name })
        .expect(201);
      const body = test.body as FullList;

      const expected: FullList = { ...basicTestList, id: body.id };
      expect(body.id).to.not.be.empty;
      expect(body).to.deep.equal(expected);
    });

    it("should trim fields when creating a list", async () => {
      const test = await request(app)
        .post("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .send({
          name: " to trim    ",
          products: [
            { name: " a trimmed name  ", note: "   a note   " },
            { name: "product", note: "     " },
          ],
        })
        .expect(201);

      const body = test.body as FullList;
      expect(body.name).to.equal("to trim");
      expect(body.products[0].name).to.equal("a trimmed name");
      expect(body.products[0].note).to.equal("a note");
      expect(body.products[1].note).to.be.null;
    });

    it("should create a basic list without being affected by id field", async () => {
      const list: FullList = {
        ...basicTestList,
        name: "@#$@#$%",
        color: "GREEN",
      };
      const fakeId = "d5b6c649-b669-4ec2-8267-adbeae8909d0";

      const test = await request(app)
        .post("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .send({
          id: fakeId,
          name: list.name,
          color: list.color,
        });

      const body = test.body as FullList;
      const expected: FullList = { ...list, id: body.id };
      expect(body.id).to.not.equal(fakeId);
      expect(body).to.deep.equal(expected);
    });

    it("should create a basic list without being affected by participants field", async () => {
      const list: FullList = {
        ...basicTestList,
        name: "colored list",
        color: "GREEN",
      };

      const test = await request(app)
        .post("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .send({
          name: list.name,
          color: list.color,
          participants: [dummyParticipants[1]],
        });

      const body = test.body as FullList;
      const expected: FullList = { ...list, id: body.id };
      expect(body).to.deep.equal(expected);
    });

    it("should create a list with products", async () => {
      const newList: CreateListInput = {
        name: "A product list",
        color: "BLUE",
        products: [
          { name: "first product" },
          { name: "second", note: "%#$T^$%^&", isChecked: true },
          { name: "third", note: "the number three product" },
        ],
      };

      const test = await request(app)
        .post("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .send(newList)
        .expect(201);

      const body = test.body as FullList;
      const expected: FullList = {
        ...basicTestList,
        ...newList,
        id: body.id,
        products: (newList.products ?? []).map((product, i) => ({
          ...product,
          id: body.products[i].id,
          note: product.note ?? null,
          isChecked: product.isChecked ?? false,
        })),
      };

      expect(body).to.deep.equal(expected);
      expect(body.products[0].id).to.not.be.empty;
      expect(body.products[1].id).to.not.be.empty;
    });

    it("should create a list with products without being affected by id", async () => {
      const newList = {
        name: "A product list",
        products: [
          { id: "860917d0-830f-43fc-98ad-6b1498c9f9e1", name: "first product" },
          {
            id: "b556845c-0770-4a4a-8218-9f86f2f08aec",
            name: "second",
            note: "the number two product",
            isChecked: true,
          },
        ],
      };

      const test = await request(app)
        .post("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .send(newList)
        .expect(201);

      const body = test.body as FullList;
      expect(body.products[0].id).to.not.equal(newList.products[0].id);
      expect(body.products[1].id).to.not.equal(newList.products[1].id);
    });

    it("should not create a list with too many products", async () => {
      const newList: CreateListInput = {
        name: "A product list",
        color: "BLUE",
        products: new Array(resourceLimits.PRODUCT_LIMIT + 1).fill({
          name: "product",
        }),
      };

      const test = await request(app)
        .post("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .send(newList)
        .expect(403);

      const body = test.body as ErrorResponse;
      expect(body.error.code).to.equal("TOO_MANY_PRODUCTS");
    });

    it("should not create a list after exceeding the list limit", async () => {
      await ListService.deleteAllUserLists(dummyUserInputs[0].id);

      const newList: CreateListInput = {
        name: "A list",
        color: "YELLOW",
      };

      for (let i = 0; i < resourceLimits.LIST_LIMIT; i++) {
        await createTestList(jwts[0], newList).expect(201);
      }

      const test = await request(app)
        .post("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .send(newList)
        .expect(403);

      const body = test.body as ErrorResponse;
      expect(body.error.code).to.equal("TOO_MANY_LISTS");

      await ListService.deleteAllUserLists(dummyUserInputs[0].id);
    });

    it("should return 415 for invalid json when creating a list", async () => {
      await request(app)
        .post("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .set("Content-Type", "text/plain")
        .send('{"name": "list","color": "GREEN"}')
        .expect(415);

      const test = await request(app)
        .post("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .set("Content-Type", "application/json")
        .send('{"name": "list","color": "GREEN"')
        .expect(400);

      const body = test.body as ErrorResponse;
      expect(body.error).to.not.have.property("data");
    });

    describe("creating an invalid list", () => {
      it("should not create a list with invalid data", async () => {
        const listAmount = (
          (
            await request(app)
              .get("/api/lists")
              .auth(jwts[0], { type: "bearer" })
          ).body as FullList[]
        ).length;

        await request(app)
          .post("/api/lists")
          .auth(jwts[0], { type: "bearer" })
          .send({ name: "a".repeat(100) })
          .expect(400);

        const newListAmount = (
          (
            await request(app)
              .get("/api/lists")
              .auth(jwts[0], { type: "bearer" })
          ).body as FullList[]
        ).length;

        expect(newListAmount).to.equal(listAmount);
      });

      [...invalidListTestCases, ...invalidListCreateTestCases].forEach(
        (testCase) => {
          it(`should return 400 for creating a list with ${testCase.description}`, async () => {
            const test = await request(app)
              .post("/api/lists")
              .auth(jwts[0], { type: "bearer" })
              .send(testCase.input)
              .expect(400);

            const body = test.body as ErrorResponse;
            expect(body.error.code).to.equal("VALIDATION_ERROR");
            const errorData = body.error.data as {
              path: string;
            }[];
            expect(errorData.length).to.equal(
              testCase.expectedErrorPaths.length,
            );
            testCase.expectedErrorPaths.forEach((expectedPath, index) => {
              expect(errorData[index].path).to.deep.equal(expectedPath);
            });
          });
        },
      );
    });

    describe("creating a list with invalid products", () => {
      [...invalidProductTestCases, ...invalidProductCreateTestCases].forEach(
        (testCase) => {
          const newList: CreateListInput = {
            name: "list",
            color: "BLUE",
            products: [{ name: "valid product" }],
          };

          it(`should return 400 for creating a list with a product with ${testCase.description}`, async () => {
            const test = await request(app)
              .post("/api/lists")
              .auth(jwts[0], { type: "bearer" })
              .send({
                ...newList,
                products: [...(newList.products ?? []), { ...testCase.input }],
              })
              .expect(400);

            const body = test.body as ErrorResponse;
            expect(body.error.code).to.equal("VALIDATION_ERROR");
            const errorData = body.error.data as {
              path: string;
            }[];
            expect(errorData.length).to.equal(
              testCase.expectedErrorPaths.length,
            );
            testCase.expectedErrorPaths.forEach((expectedPath, index) => {
              expect(errorData[index].path).to.deep.equal([
                "products",
                1,
                ...expectedPath,
              ]);
            });
          });
        },
      );
    });
  });

  describe("getting all lists", () => {
    it("should get an empty list array", async () => {
      for (const user of dummyUserInputs) {
        await ListService.deleteAllUserLists(user.id);
      }

      const test = await request(app)
        .get("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .expect(200);

      expect(test.body).to.be.an("array").that.is.empty;
    });

    it("should get all lists and in order", async () => {
      for (const user of dummyUserInputs) {
        await ListService.deleteAllUserLists(user.id);
      }

      const expected: FullList[] = [];
      expected.push(
        (await createTestList(jwts[0], { name: "first list", color: "BLUE" }))
          .body as FullList,
      );
      expected.push(
        (await createTestList(jwts[0], { name: "second list", color: "GREEN" }))
          .body as FullList,
      );
      expected.push(
        (
          await createTestList(jwts[0], {
            name: "products",
            color: "PINK",
            products: [
              { name: "apple" },
              { name: "banana", isChecked: true, note: "2" },
              { name: "orange", note: "blue" },
            ],
          })
        ).body as FullList,
      );

      const test = await request(app)
        .get("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .expect(200);

      expect(test.body).to.deep.equal(expected);
    });

    it("should only get the lists that the user is participating in", async () => {
      await createTestList(jwts[0], { name: "first list", color: "BLUE" });
      await createTestList(jwts[1], { name: "second list", color: "GREEN" });

      const test = await request(app)
        .get("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .expect(200);

      const body = test.body as FullList[];
      expect(
        body.every((l: FullList) =>
          l.participants.some((p) => p.user.id === dummyUserInputs[0].id),
        ),
      ).to.be.true;
    });

    it("should get lists as a basic user", async () => {
      const list = (
        await createTestList(jwts[1], {
          name: "first list",
          color: "BLUE",
        })
      ).body as FullList;
      const token = (
        (await createTestInviteToken(jwts[1], list.id))
          .body as TokenInvitationDetails
      ).token;
      await joinTestList(jwts[0], token);

      const test = await request(app)
        .get("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .expect(200);
      const body = test.body as FullList[];
      expect(body.some((l: FullList) => l.id === list.id)).to.be.true;
    });

    it("should get lists with other participants", async () => {
      const list = (
        await createTestList(jwts[0], {
          name: "list with participants",
        })
      ).body as FullList;
      const token = (
        (await createTestInviteToken(jwts[0], list.id))
          .body as TokenInvitationDetails
      ).token;
      await joinTestList(jwts[1], token);
      await joinTestList(jwts[2], token);

      const test = await request(app)
        .get("/api/lists")
        .auth(jwts[0], { type: "bearer" })
        .expect(200);

      const expected: FullList = { ...list, participants: dummyParticipants };
      const body = test.body as FullList[];
      expect(body.find((l: FullList) => l.id === list.id)).to.deep.equal(
        expected,
      );
    });
  });

  describe("getting a list", () => {
    it("should get a list", async () => {
      const list = (
        await createTestList(jwts[0], {
          name: "new list",
        })
      ).body as FullList;

      const test = await request(app)
        .get(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(200);

      expect(test.body).to.deep.equal(list);
    });

    it("should get a list with products", async () => {
      const list = (
        await createTestList(jwts[0], {
          name: "new list",
          color: "BLUE",
          products: [
            { name: "apple" },
            { name: "banana", isChecked: true, note: "2" },
            { name: "orange", note: "blue" },
          ],
        })
      ).body as FullList;

      const test = await request(app)
        .get(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(200);

      expect(test.body).to.deep.equal(list);
    });

    it("should get a list with participants", async () => {
      const list = (
        await createTestList(jwts[0], {
          name: "new list",
          products: [{ name: "apple" }],
        })
      ).body as FullList;
      const token = (
        (await createTestInviteToken(jwts[0], list.id))
          .body as TokenInvitationDetails
      ).token;
      await joinTestList(jwts[1], token);
      await joinTestList(jwts[2], token);

      const test = await request(app)
        .get(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(200);

      const expected: FullList = { ...list, participants: dummyParticipants };
      expect(test.body).to.deep.equal(expected);
    });

    it("should get a list as a basic user", async () => {
      const list = (
        await createTestList(jwts[0], {
          name: "new list",
          color: "BROWN",
        })
      ).body as FullList;
      const token = (
        (await createTestInviteToken(jwts[0], list.id))
          .body as TokenInvitationDetails
      ).token;
      await joinTestList(jwts[1], token);

      const test = await request(app)
        .get(`/api/lists/${list.id}`)
        .auth(jwts[1], { type: "bearer" })
        .expect(200);

      const expected: FullList = {
        ...list,
        participants: [dummyParticipants[0], dummyParticipants[1]],
      };
      expect(test.body).to.deep.equal(expected);
    });

    it("should return 404 for getting a non-existing list", async () => {
      const fakeId = "ac59376b-7e6e-4936-bd57-c1920a9267d3";
      const test = await request(app)
        .get(`/api/lists/${fakeId}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      const body = test.body as ErrorResponse;
      expect(body.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should return 404 for getting a list without being a participant", async () => {
      const list = (
        await createTestList(jwts[1], {
          name: "another person's list",
        })
      ).body as FullList;

      const test = await request(app)
        .get(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      const body = test.body as ErrorResponse;
      expect(body.error.code).to.equal("LIST_NOT_FOUND");
    });
  });

  describe("updating a list", () => {
    it("should update a list", async () => {
      const list = (
        await createTestList(jwts[0], {
          name: "list to update",
        })
      ).body as FullList;

      const listUpdate: EditListInput = {
        name: "Updated!",
        color: "BLUE",
      };

      const test = await request(app)
        .patch(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send(listUpdate)
        .expect(200);

      const expected = { ...listUpdate, id: list.id };
      expect(test.body).to.deep.equal(expected);

      const actualList = (await getTestList(jwts[0], list.id)).body as FullList;
      expect(actualList).to.deep.equal({
        ...basicTestList,
        ...expected,
      });
    });

    it("should trim fields when updating list", async () => {
      const list = (
        await createTestList(jwts[0], {
          name: "update list",
        })
      ).body as FullList;

      const test = await request(app)
        .patch(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send({ name: "     trim      " })
        .expect(200);

      const body = test.body as ListDetails;
      expect(body.name).to.equal("trim");
    });

    it("should update a list without updating id", async () => {
      const list = (
        await createTestList(jwts[0], {
          name: "list to update",
          color: "GREEN",
          products: [{ name: "product" }],
        })
      ).body as FullList;

      const patchedList: EditListInput = {
        name: "another list",
        color: "GRAY",
      };
      const fakeId = "d5b6c649-b669-4ec2-8267-adbeae8909d0";

      const test = await request(app)
        .patch(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send({ ...patchedList, id: fakeId })
        .expect(200);

      const body = test.body as ListDetails;
      expect(body.id).to.not.equal(fakeId);
      expect(body).to.deep.equal({ ...patchedList, id: list.id });
    });

    it("should update only one field", async () => {
      const list = (
        await createTestList(jwts[0], {
          name: "list for one field",
        })
      ).body as FullList;

      const patchedList: EditListInput = {
        name: "New List",
        color: "PINK",
      };

      const nameTest = await request(app)
        .patch(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send({ name: patchedList.name })
        .expect(200);

      expect(nameTest.body).to.deep.equal({
        name: patchedList.name,
        color: list.color,
        id: list.id,
      });

      const colorTest = await request(app)
        .patch(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send({ color: patchedList.color })
        .expect(200);

      expect(colorTest.body).to.deep.equal({ ...patchedList, id: list.id });
    });

    it("should update list as a basic user", async () => {
      const list = (
        await createTestList(jwts[1], {
          name: "list to update",
        })
      ).body as FullList;
      const token = (
        (await createTestInviteToken(jwts[1], list.id))
          .body as TokenInvitationDetails
      ).token;
      await joinTestList(jwts[0], token);

      const listUpdate: EditListInput = {
        name: "^%$^$%^.",
        color: "GREEN",
      };

      const test = await request(app)
        .patch(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send(listUpdate)
        .expect(200);

      const expected = { ...listUpdate, id: list.id };
      expect(test.body).to.deep.equal(expected);
    });

    it("should not update products or participants when updating list", async () => {
      const list = (
        await createTestList(jwts[0], {
          name: "a list",
          products: [{ name: "a product" }],
        })
      ).body as FullList;

      const listUpdate: EditListInput = {
        name: "Updated!",
        color: "BLUE",
      };

      await request(app)
        .patch(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send({
          ...listUpdate,
          products: [
            {
              id: "ebf25dea-7870-45d4-8ae7-1c98e7b0425a",
              name: "another product",
              isChecked: true,
            },
          ],
          participants: [dummyParticipants[1], dummyParticipants[0]],
        })
        .expect(200);

      const expected: FullList = { ...list, ...listUpdate };
      const actualList = (await getTestList(jwts[0], list.id)).body as FullList;
      expect(actualList).to.deep.equal(expected);
    });

    it("should return 404 for updating a non-existing list", async () => {
      const fakeId = "ac59376b-7e6e-4936-bd57-c1920a9267d3";
      const test = await request(app)
        .patch(`/api/lists/${fakeId}`)
        .auth(jwts[0], { type: "bearer" })
        .send({
          name: "Unknown",
          color: "YELLOW",
        })
        .expect(404);

      const body = test.body as ErrorResponse;
      expect(body.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should return 404 for updating a list without being a participant", async () => {
      const list = (
        await createTestList(jwts[1], {
          name: "another person's list",
        })
      ).body as FullList;

      const test = await request(app)
        .patch(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send({
          name: "Unknown",
          color: "YELLOW",
        })
        .expect(404);

      const body = test.body as ErrorResponse;
      expect(body.error.code).to.equal("LIST_NOT_FOUND");
      const actualList = (await getTestList(jwts[1], list.id)).body as FullList;
      expect(actualList.name).to.equal(list.name);
    });

    it("should return 415 for invalid json when updating a list", async () => {
      const list = (await createTestList(jwts[0], { name: "a list" }))
        .body as FullList;

      await request(app)
        .patch(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .set("Content-Type", "text/plain")
        .send('{"name": "list","color": "GREEN"}')
        .expect(415);

      const test = await request(app)
        .patch(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .set("Content-Type", "application/json")
        .send('{"name": "list","color": "GREEN"')
        .expect(400);

      const body = test.body as ErrorResponse;
      expect(body.error).to.not.have.property("data");
    });

    describe("updating a list with invalid values", () => {
      let list: FullList;

      before(async () => {
        list = (await createTestList(jwts[0], { name: "list to not update" }))
          .body as FullList;
      });

      it("should not update list with invalid data", async () => {
        await request(app)
          .patch(`/api/lists/${list.id}`)
          .auth(jwts[0], { type: "bearer" })
          .send({ name: "a".repeat(100) })
          .expect(400);

        const test = await getTestList(jwts[0], list.id);
        const body = test.body as FullList;
        expect(body.name).to.equal(list.name);
      });

      [...invalidListTestCases, ...invalidListUpdateTestCases].forEach(
        (testCase) => {
          it(`should return 400 for updating a list with ${testCase.description}`, async () => {
            const test = await request(app)
              .patch(`/api/lists/${list.id}`)
              .auth(jwts[0], { type: "bearer" })
              .send(testCase.input)
              .expect(400);

            const body = test.body as ErrorResponse;
            expect(body.error.code).to.equal("VALIDATION_ERROR");
            const errorData = body.error.data as {
              path: string;
            }[];
            expect(errorData.length).to.equal(
              testCase.expectedErrorPaths.length,
            );
            testCase.expectedErrorPaths.forEach((expectedPath, index) => {
              expect(errorData[index].path).to.deep.equal(expectedPath);
            });
          });
        },
      );
    });
  });

  describe("deleting a list", () => {
    it("should delete a list", async () => {
      const list = (
        await createTestList(jwts[0], {
          name: "list to delete",
          products: [{ name: "product" }],
        })
      ).body as FullList;

      const test = await request(app)
        .delete(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(204);

      expect(test.noContent).to.be.true;

      const getListTest = await getTestList(jwts[0], list.id).expect(404);
      const getListTestBody = getListTest.body as ErrorResponse;
      expect(getListTestBody.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should not delete a list if not owner", async () => {
      const list = (
        await createTestList(jwts[1], {
          name: "list to not delete",
        })
      ).body as FullList;
      const token = (
        (await createTestInviteToken(jwts[1], list.id))
          .body as TokenInvitationDetails
      ).token;
      await joinTestList(jwts[0], token);

      const test = await request(app)
        .delete(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(403);

      const body = test.body as ErrorResponse;
      expect(body.error.code).to.equal("NOT_PERMITTED");
      await getTestList(jwts[0], list.id).expect(200);
    });

    it("should return 404 for deleting a non-existing list", async () => {
      const fakeId = "ac59376b-7e6e-4936-bd57-c1920a9267d3";
      const test = await request(app)
        .delete(`/api/lists/${fakeId}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      const body = test.body as ErrorResponse;
      expect(body.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should return 404 for deleting a list without being a participant", async () => {
      const list = (
        await createTestList(jwts[1], {
          name: "another person's list",
        })
      ).body as FullList;

      const test = await request(app)
        .delete(`/api/lists/${list.id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);

      const body = test.body as ErrorResponse;
      expect(body.error.code).to.equal("LIST_NOT_FOUND");
      await getTestList(jwts[1], list.id).expect(200);
    });
  });
};

export default listsDescribe;
