import { ZodErrorMap } from "zod";

const zodErrorMap: ZodErrorMap = (issue, ctx) => {
  let message = ctx.defaultError;

  switch (issue.code) {
    case "invalid_type":
      if (issue.received === "undefined") {
        message = "Value is required";
      } else {
        message = "Value must be of type " + issue.expected;
      }

      break;
    case "too_small": {
      if (issue.inclusive) {
        if (issue.type === "string") {
          if (issue.minimum === 1) {
            message = "String cannot be empty";
          } else {
            message =
              "String must have at least " + issue.minimum + " characters";
          }
        } else if (issue.type === "number" || issue.type === "bigint") {
          message = "Number must be at least " + issue.minimum;
        } else if (issue.type === "array") {
          message = "Array must have at least " + issue.minimum + " elements";
        }
      }

      break;
    }
    case "too_big": {
      if (issue.inclusive) {
        if (issue.type === "string") {
          message = "String must have at most " + issue.maximum + " characters";
        } else if (issue.type === "number" || issue.type === "bigint") {
          message = "Number must be " + issue.maximum + " or less";
        } else if (issue.type === "array") {
          message = "Array must have at most " + issue.maximum + " elements";
        }
      }

      break;
    }
    case "invalid_enum_value":
      const options = issue.options.map((o) =>
        typeof o === "string" ? `'${o}'` : o
      );
      message =
        "Invalid value. Value must be one of the following: " +
        options.join(", ");

      break;
    default:
      break;
  }

  return { message };
};

export default zodErrorMap;
