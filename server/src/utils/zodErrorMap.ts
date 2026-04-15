import z, { ZodEnum } from "zod";

const zodErrorMap: z.core.$ZodErrorMap = (issue) => {
  switch (issue.code) {
    case "invalid_type":
      if (issue.input === undefined) {
        return "Value is required";
      }
      return "Value must be of type " + issue.expected;
    case "too_small":
      if (issue.inclusive) {
        if (issue.origin === "string") {
          if (issue.minimum === 1) {
            return "String cannot be empty";
          } else {
            return (
              "String must have at least " +
              issue.minimum.toString() +
              " characters"
            );
          }
        } else if (issue.origin === "number" || issue.origin === "bigint") {
          return "Number must be at least " + issue.minimum.toString();
        } else if (issue.origin === "array") {
          return (
            "Array must have at least " + issue.minimum.toString() + " elements"
          );
        }
      }

      break;
    case "too_big":
      if (issue.inclusive) {
        if (issue.origin === "string") {
          return (
            "String must have at most " +
            issue.maximum.toString() +
            " characters"
          );
        } else if (issue.origin === "number" || issue.origin === "bigint") {
          return "Number must be " + issue.maximum.toString() + " or less";
        } else if (issue.origin === "array") {
          return (
            "Array must have at most " + issue.maximum.toString() + " elements"
          );
        }
      }

      break;
    case "invalid_value":
      if (issue.inst instanceof ZodEnum) {
        const options = issue.values.map((o) =>
          typeof o === "string" ? `'${o}'` : o,
        );
        return (
          "Invalid value. Value must be one of the following: " +
          options.join(", ")
        );
      }

      break;
    default:
      return undefined;
  }
};

export default zodErrorMap;
