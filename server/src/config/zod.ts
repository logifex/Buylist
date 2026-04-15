import { z } from "zod";
import { zodErrorMap } from "../utils/index.js";

const configZod = () => {
  z.config({ customError: zodErrorMap });
};

export default configZod;
