type TestCases = {
  description: string;
  input: any;
  expectedErrorPaths: (string | number)[][];
}[];

export const invalidListTestCases: TestCases = [
  {
    description: "invalid name (not a string)",
    input: {
      name: 3,
    },
    expectedErrorPaths: [["name"]],
  },
  {
    description: "invalid name (too long)",
    input: {
      name: "gserklpvsdfplvksdfmvplsdfkvpsodlvksdpocvksdco-0psdmvpsdfolvkmdfpovsdkvposdkcvopsdkcfsdpofkdsopfkpo",
    },
    expectedErrorPaths: [["name"]],
  },
  {
    description: "invalid name (empty string)",
    input: {
      name: "",
      color: "BLUE",
    },
    expectedErrorPaths: [["name"]],
  },
  {
    description: "invalid name (null)",
    input: {
      name: null,
      color: "BLUE",
    },
    expectedErrorPaths: [["name"]],
  },
  {
    description: "invalid color (not a valid color)",
    input: {
      name: "A product list",
      color: "invalid",
    },
    expectedErrorPaths: [["color"]],
  },
  {
    description: "invalid color (not a string)",
    input: {
      name: "A product list",
      color: true,
    },
    expectedErrorPaths: [["color"]],
  },
  {
    description: "invalid name and color",
    input: {
      name: null,
      color: true,
    },
    expectedErrorPaths: [["name"], ["color"]],
  },
];

export const invalidListCreateTestCases: TestCases = [
  {
    description: "invalid name (undefined)",
    input: {
      color: "BLUE",
    },
    expectedErrorPaths: [["name"]],
  },
  {
    description: "invalid name (empty object)",
    input: {},
    expectedErrorPaths: [["name"]],
  },
  {
    description: "invalid products (not an array)",
    input: {
      name: "products",
      products: 3,
    },
    expectedErrorPaths: [["products"]],
  },
  {
    description: "multiple invalid products",
    input: {
      name: "products",
      products: [
        { note: "a note" },
        { name: "product", note: true, isChecked: 3 },
      ],
    },
    expectedErrorPaths: [
      ["products", 0, "name"],
      ["products", 1, "note"],
      ["products", 1, "isChecked"],
    ],
  },
  {
    description: "invalid name, color and products",
    input: {
      name: null,
      color: true,
      products: null,
    },
    expectedErrorPaths: [["name"], ["color"], ["products"]],
  },
];

export const invalidListUpdateTestCases: TestCases = [
  {
    description: "invalid data (empty object)",
    input: {},
    expectedErrorPaths: [[]],
  },
  {
    description: "only invalid color",
    input: {
      color: 15,
    },
    expectedErrorPaths: [["color"]],
  },
];

export const invalidProductTestCases: TestCases = [
  {
    description: "invalid name (not a string)",
    input: {
      name: 3,
    },
    expectedErrorPaths: [["name"]],
  },
  {
    description: "invalid name (too long)",
    input: {
      name: "gserklpvsdfplvksdfmvplsdfkvpsodlvksdpocvksdco-0psdmvpsdfolvkmdfpovsdkvposdkcvopsdkcfsdpofkdsopfkpo",
    },
    expectedErrorPaths: [["name"]],
  },
  {
    description: "invalid name (empty string)",
    input: {
      name: "",
      note: "noted",
    },
    expectedErrorPaths: [["name"]],
  },
  {
    description: "invalid name (null)",
    input: {
      name: null,
      note: "3 units",
    },
    expectedErrorPaths: [["name"]],
  },
  {
    description: "invalid note (not a string)",
    input: {
      name: "product",
      note: 3,
    },
    expectedErrorPaths: [["note"]],
  },
  {
    description: "invalid note (too long)",
    input: {
      name: "product",
      note: "gserklpvsdfplvksdfmvplsdfkvpsodlvksdpocvksdco-0psdmvpsdfolvkmdfpovsdkvposdkcvopsdkcfsdpofkdsopfkpo",
    },
    expectedErrorPaths: [["note"]],
  },
  {
    description: "invalid isChecked (not a boolean)",
    input: {
      name: "product",
      isChecked: "true",
    },
    expectedErrorPaths: [["isChecked"]],
  },
  {
    description: "invalid name and note",
    input: {
      name: null,
      note: true,
    },
    expectedErrorPaths: [["name"], ["note"]],
  },
  {
    description: "invalid name, note and isChecked",
    input: {
      name: null,
      note: true,
      isChecked: 3,
    },
    expectedErrorPaths: [["name"], ["note"], ["isChecked"]],
  },
];

export const invalidProductCreateTestCases: TestCases = [
  {
    description: "invalid name (undefined)",
    input: {
      note: "ONE",
      isChecked: false,
    },
    expectedErrorPaths: [["name"]],
  },
  {
    description: "invalid name (empty object)",
    input: {},
    expectedErrorPaths: [["name"]],
  },
  {
    description: "no name and invalid note and isChecked",
    input: { note: true, isChecked: "200" },
    expectedErrorPaths: [["name"], ["note"], ["isChecked"]],
  },
];

export const invalidProductUpdateTestCases: TestCases = [
  {
    description: "invalid data (empty object)",
    input: {},
    expectedErrorPaths: [[]],
  },
  {
    description: "only invalid note",
    input: {
      note: false,
    },
    expectedErrorPaths: [["note"]],
  },
  {
    description: "only invalid isChecked",
    input: {
      isChecked: 15,
    },
    expectedErrorPaths: [["isChecked"]],
  },
  {
    description: "invalid note and isChecked",
    input: {
      note: 15,
      isChecked: "false",
    },
    expectedErrorPaths: [["note"], ["isChecked"]],
  },
];
