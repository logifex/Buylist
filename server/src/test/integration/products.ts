import request from "supertest";
import {
  CreateProductInput,
  EditProductInput,
  ProductDetails,
} from "../../types/product";
import {
  invalidProductCreateTestCases,
  invalidProductTestCases,
  invalidProductUpdateTestCases,
} from "../utils/testCases";
import {
  createTestList,
  createTestInviteToken,
  getTestJwt,
  getTestList,
  joinTestList,
} from "../utils/commonRequests";
import app from "../../app";
import { expect } from "chai";
import { FullList } from "../../types/list";
import { dummyUserInputs } from "../utils/dummyInputs";

const USER_AMOUNT = 2;

const productsDescribe = () => {
  const jwts: string[] = [];

  before(async () => {
    for (let i = 0; i < USER_AMOUNT; i++) {
      jwts.push(await getTestJwt(dummyUserInputs[i].id!));
    }
  });

  describe("creating a product", () => {
    it("should create a product", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
        products: [{ name: "product" }],
      });

      const product: CreateProductInput = {
        name: "banana",
        note: "only one",
        isChecked: true,
      };

      const test = await request(app)
        .post(`/api/lists/${list.id}/products`)
        .auth(jwts[0], { type: "bearer" })
        .send(product)
        .expect(201);

      const expected = { ...product, id: test.body.id };
      expect(test.body.id).to.not.be.empty;
      expect(test.body).to.deep.equal(expected);

      const actualProducts: ProductDetails[] = (
        await getTestList(jwts[0], list.id)
      ).body.products;
      expect(actualProducts[0]).to.deep.equal(list.products[0]);
      expect(actualProducts[1]).to.deep.equal(expected);
    });

    it("should trim fields when creating a product", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
      });

      const test = await request(app)
        .post(`/api/lists/${list.id}/products`)
        .auth(jwts[0], { type: "bearer" })
        .send({ name: "    name      ", note: "     note     " })
        .expect(201);

      expect(test.body.name).to.equal("name");
      expect(test.body.note).to.equal("note");
    });

    it("should create a product without being affected by id field", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
      });

      const fakeId = "c7601d9e-fe18-47b5-9d2a-d1ed622cbec2";
      const product: CreateProductInput = {
        name: "^$%^$%&%^*",
        note: null,
        isChecked: false,
      };

      const test = await request(app)
        .post(`/api/lists/${list.id}/products`)
        .auth(jwts[0], { type: "bearer" })
        .send({ id: fakeId, ...product })
        .expect(201);

      expect(test.body.id).to.not.equal(fakeId);
      expect(test.body).to.deep.equal({ ...product, id: test.body.id });
    });

    it("should create a product as a basic user", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list for products",
        color: "YELLOW",
      });
      const token = (await createTestInviteToken(jwts[1], list.id)).body.token;
      await joinTestList(jwts[0], token);

      const product: CreateProductInput = {
        name: "orange",
        note: "*%^&*^%&%$",
        isChecked: true,
      };

      const test = await request(app)
        .post(`/api/lists/${list.id}/products`)
        .auth(jwts[0], { type: "bearer" })
        .send(product)
        .expect(201);

      const expected = { ...product, id: test.body.id };
      expect(test.body).to.deep.equal(expected);
    });

    it("should return 404 for creaing a product in a non-existing list", async () => {
      const fakeId = "e3d0c91e-f1d3-46b2-8aca-dad3ea0be77a";

      const test = await request(app)
        .post(`/api/lists/${fakeId}/products`)
        .auth(jwts[0], { type: "bearer" })
        .send({ name: "product" })
        .expect(404);
      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should return 404 for creating a product without being a participant", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list for products",
      });

      const test = await request(app)
        .post(`/api/lists/${list.id}/products`)
        .auth(jwts[0], { type: "bearer" })
        .send({ name: "product" })
        .expect(404);
      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");

      const actualProducts: ProductDetails[] = (
        await getTestList(jwts[1], list.id)
      ).body.products;
      expect(actualProducts.length).to.equal(list.products.length);
    });

    it("should return 415 for invalid json when creating a product", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
      });

      await request(app)
        .post(`/api/lists/${list.id}/products`)
        .auth(jwts[0], { type: "bearer" })
        .set("Content-Type", "text/plain")
        .send('{"name": "product","note": "one"}')
        .expect(415);

      const test = await request(app)
        .post(`/api/lists/${list.id}/products`)
        .auth(jwts[0], { type: "bearer" })
        .set("Content-Type", "application/json")
        .send('{"name": "product","note": "one"')
        .expect(400);

      expect(test.body.error).to.not.have.property("data");
    });

    describe("creating an invalid product", () => {
      let list: FullList;

      before(async () => {
        list = (await createTestList(jwts[0], { name: "list for products" })).body;
      });

      it("should not create a product with invalid data", async () => {
        await request(app)
          .post(`/api/lists/${list.id}/products`)
          .auth(jwts[0], { type: "bearer" })
          .send({ name: "a".repeat(100) })
          .expect(400);

        const actualProducts: ProductDetails[] = (
          await getTestList(jwts[0], list.id)
        ).body.products;
        expect(actualProducts.length).to.equal(list.products.length);
      });

      [...invalidProductTestCases, ...invalidProductCreateTestCases].forEach(
        (testCase) => {
          it(`should return 400 for creating a product with ${testCase.description}`, async () => {
            const test = await request(app)
              .post(`/api/lists/${list.id}/products`)
              .auth(jwts[0], { type: "bearer" })
              .send(testCase.input)
              .expect(400);

            expect(test.body.error.code).to.equal("VALIDATION_ERROR");
            expect(test.body.error.data.length).to.equal(
              testCase.expectedErrorPaths.length
            );
            testCase.expectedErrorPaths.forEach((expectedPath, index) => {
              expect(test.body.error.data[index].path).to.deep.equal(
                expectedPath
              );
            });
          });
        }
      );
    });
  });

  describe("updating a product", () => {
    it("should update a product", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
        products: [
          { name: "product", note: "note", isChecked: true },
          {
            name: "apple",
            note: "one",
            isChecked: false,
          },
        ],
      });
      const originalProduct = list.products[1];

      const productUpdate: EditProductInput = {
        name: "orange",
        note: "two",
        isChecked: true,
      };

      const test = await request(app)
        .patch(`/api/lists/${list.id}/products/${originalProduct.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send(productUpdate)
        .expect(200);

      const expected = {
        ...productUpdate,
        id: originalProduct.id,
      };
      expect(test.body).to.deep.equal(expected);

      const actualProducts: ProductDetails[] = (
        await getTestList(jwts[0], list.id)
      ).body.products;
      expect(actualProducts[0]).to.deep.equal(list.products[0]);
      expect(actualProducts[1]).to.deep.equal(expected);
    });

    it("should trim fields when updating a product", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
        products: [{ name: "a product" }],
      });
      const originalProduct: ProductDetails = list.products[0];

      const test = await request(app)
        .patch(`/api/lists/${list.id}/products/${originalProduct.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send({ name: "   a product      ", note: "     a note   " })
        .expect(200);

      expect(test.body.name).to.equal("a product");
      expect(test.body.note).to.equal("a note");
    });

    it("should update a product without updating id", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
        color: "RED",
        products: [
          {
            name: "orange",
            isChecked: true,
          },
        ],
      });
      const originalProduct: ProductDetails = list.products[0];

      const productUpdate: EditProductInput = {
        name: "banana",
        note: "300",
      };
      const fakeId = "b436d30d-9f56-4980-8df4-2903eb73e96e";

      const test = await request(app)
        .patch(`/api/lists/${list.id}/products/${originalProduct.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send({ ...productUpdate, id: fakeId })
        .expect(200);

      expect(test.body.id).to.not.equal(fakeId);
      expect(test.body).to.deep.equal({
        ...originalProduct,
        ...productUpdate,
      });
    });

    it("should update only one field", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
        products: [
          {
            name: "^$%^$#%%#$",
          },
        ],
      });
      const originalProduct: ProductDetails = list.products[0];

      const productUpdate: EditProductInput = {
        note: "200",
        isChecked: true,
      };

      const isCheckedTest = await request(app)
        .patch(`/api/lists/${list.id}/products/${originalProduct.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send({ isChecked: productUpdate.isChecked })
        .expect(200);

      expect(isCheckedTest.body).to.deep.equal({
        ...originalProduct,
        isChecked: productUpdate.isChecked,
      });

      const noteTest = await request(app)
        .patch(`/api/lists/${list.id}/products/${originalProduct.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send({ note: productUpdate.note })
        .expect(200);

      expect(noteTest.body).to.deep.equal({
        ...originalProduct,
        ...productUpdate,
      });
    });

    it("should update a product as a basic user", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list for products",
        products: [
          {
            name: "apple",
          },
        ],
      });
      const originalProduct: ProductDetails = list.products[0];

      const token = (await createTestInviteToken(jwts[1], list.id)).body.token;
      await joinTestList(jwts[0], token);

      const productUpdate: EditProductInput = {
        name: "orange",
        note: "$#$@#$",
        isChecked: true,
      };

      const test = await request(app)
        .patch(`/api/lists/${list.id}/products/${originalProduct.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send(productUpdate)
        .expect(200);

      const expected = {
        ...productUpdate,
        id: originalProduct.id,
      };
      expect(test.body).to.deep.equal(expected);
    });

    it("should return 404 for updating a non-existing product", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
      });

      const productUpdate: EditProductInput = {
        name: "New Product",
      };
      const fakeId = "b436d30d-9f56-4980-8df4-2903eb73e96e";

      const test = await request(app)
        .patch(`/api/lists/${list.id}/products/${fakeId}`)
        .auth(jwts[0], { type: "bearer" })
        .send(productUpdate)
        .expect(404);
      expect(test.body.error.code).to.equal("PRODUCT_NOT_FOUND");
    });

    it("should return 404 for updating a product in a non-existing list", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
        products: [
          {
            name: "eggs",
          },
        ],
      });
      const originalProduct: ProductDetails = list.products[0];

      const productUpdate: EditProductInput = {
        note: "noted",
      };
      const fakeId = "b436d30d-9f56-4980-8df4-2903eb73e96e";

      const test = await request(app)
        .patch(`/api/lists/${fakeId}/products/${originalProduct.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send(productUpdate)
        .expect(404);
      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should return 404 for updating a product in wrong list", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
        products: [
          {
            name: "meat",
          },
        ],
      });
      const { body: wrongList } = await createTestList(jwts[0], {
        name: "Wrong list",
      });
      const originalProduct: ProductDetails = list.products[0];

      const productUpdate: EditProductInput = {
        name: "other product",
        note: "three hundred",
      };

      const test = await request(app)
        .patch(`/api/lists/${wrongList.id}/products/${originalProduct.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send(productUpdate)
        .expect(404);
      expect(test.body.error.code).to.equal("PRODUCT_NOT_FOUND");
    });

    it("should return 404 for updating a product without being a participant", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list for products",
        products: [
          {
            name: "bread",
          },
        ],
      });
      const product: ProductDetails = list.products[0];

      const productUpdate: EditProductInput = {
        name: "other product",
        note: "three hundred",
      };

      const test = await request(app)
        .patch(`/api/lists/${list.id}/products/${product.id}`)
        .auth(jwts[0], { type: "bearer" })
        .send(productUpdate)
        .expect(404);
      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should return 415 for invalid json when updating a product", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
        products: [
          {
            name: "some product",
            note: "more than 2",
          },
        ],
      });
      const product: ProductDetails = list.products[0];

      await request(app)
        .patch(`/api/lists/${list.id}/products/${product.id}`)
        .auth(jwts[0], { type: "bearer" })
        .set("Content-Type", "text/plain")
        .send('{"name": "product","note": "one"}')
        .expect(415);

      const test = await request(app)
        .patch(`/api/lists/${list.id}/products/${product.id}`)
        .auth(jwts[0], { type: "bearer" })
        .set("Content-Type", "application/json")
        .send('{"name": "product","note": "one"')
        .expect(400);

      expect(test.body.error).to.not.have.property("data");
    });

    describe("updating an invalid product", () => {
      let list: FullList;
      let product: ProductDetails;

      before(async () => {
        list = (
          await createTestList(jwts[0], {
            name: "list for products",
            products: [
              {
                name: "another one",
                note: "unknown",
              },
            ],
          })
        ).body;
        product = list.products[0];
      });

      it("should not update a product with invalid data", async () => {
        await request(app)
          .patch(`/api/lists/${list.id}/products/${product.id}`)
          .auth(jwts[0], { type: "bearer" })
          .send({ name: "a".repeat(100) })
          .expect(400);

        const actualProducts: ProductDetails[] = (
          await getTestList(jwts[0], list.id)
        ).body.products;
        expect(actualProducts[0].name).to.equal(product.name);
      });

      [...invalidProductTestCases, ...invalidProductUpdateTestCases].forEach(
        (testCase) => {
          it(`should return 400 for updating a product with ${testCase.description}`, async () => {
            const test = await request(app)
              .patch(`/api/lists/${list.id}/products/${product.id}`)
              .auth(jwts[0], { type: "bearer" })
              .send(testCase.input)
              .expect(400);

            expect(test.body.error.code).to.equal("VALIDATION_ERROR");
            expect(test.body.error.data.length).to.equal(
              testCase.expectedErrorPaths.length
            );
            testCase.expectedErrorPaths.forEach((expectedPath, index) => {
              expect(test.body.error.data[index].path).to.deep.equal(
                expectedPath
              );
            });
          });
        }
      );
    });
  });

  describe("deleting a product", () => {
    it("should delete a product", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
        products: [
          { name: "first product" },
          {
            name: "second",
          },
        ],
      });
      const product: ProductDetails = list.products[1];

      const test = await request(app)
        .delete(`/api/lists/${list.id}/products/${product.id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(204);

      expect(test.noContent).to.be.true;

      const actualList: FullList = (await getTestList(jwts[0], list.id)).body;
      expect(actualList.products.length).to.equal(list.products.length - 1);
      expect(actualList.products[0]).to.deep.equal(list.products[0]);
    });

    it("should delete a product as a basic user", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list for products",
        color: "BLUE",
        products: [
          { name: "product", note: "note", isChecked: true },
          {
            name: "apple",
          },
        ],
      });
      const product: ProductDetails = list.products[1];

      const token = (await createTestInviteToken(jwts[1], list.id)).body.token;
      await joinTestList(jwts[0], token);

      const test = await request(app)
        .delete(`/api/lists/${list.id}/products/${product.id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(204);

      expect(test.noContent).to.be.true;
    });

    it("should return 404 for deleting a non-existing product", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
      });
      const fakeId = "e3d0c91e-f1d3-46b2-8aca-dad3ea0be77a";

      const test = await request(app)
        .delete(`/api/lists/${list.id}/products/${fakeId}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);
      expect(test.body.error.code).to.equal("PRODUCT_NOT_FOUND");
    });

    it("should return 404 for deleting a product in non-existing list", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
        products: [
          {
            name: "eggs",
          },
        ],
      });
      const product: ProductDetails = list.products[0];
      const fakeId = "e3d0c91e-f1d3-46b2-8aca-dad3ea0be77a";

      const test = await request(app)
        .delete(`/api/lists/${fakeId}/products/${product.id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);
      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");
    });

    it("should return 404 for deleting a product in wrong list", async () => {
      const { body: list } = await createTestList(jwts[0], {
        name: "list for products",
        products: [
          {
            name: "checked",
            isChecked: true,
          },
        ],
      });
      const { body: wrongList } = await createTestList(jwts[0], {
        name: "list with no products",
      });
      const product: ProductDetails = list.products[0];

      const test = await request(app)
        .delete(`/api/lists/${wrongList.id}/products/${product.id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);
      expect(test.body.error.code).to.equal("PRODUCT_NOT_FOUND");

      const actualProducts: ProductDetails[] = (
        await getTestList(jwts[0], list.id)
      ).body.products;
      expect(actualProducts.length).to.equal(list.products.length);
    });

    it("should return 404 for deleting a product without being a participant", async () => {
      const { body: list } = await createTestList(jwts[1], {
        name: "list for products",
        products: [
          {
            name: "apple",
          },
        ],
      });
      const product: ProductDetails = list.products[0];

      const test = await request(app)
        .delete(`/api/lists/${list.id}/products/${product.id}`)
        .auth(jwts[0], { type: "bearer" })
        .expect(404);
      expect(test.body.error.code).to.equal("LIST_NOT_FOUND");

      const actualProducts: ProductDetails[] = (
        await getTestList(jwts[1], list.id)
      ).body.products;
      expect(actualProducts.length).to.equal(list.products.length);
    });
  });
};

export default productsDescribe;
