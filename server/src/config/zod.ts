import { z } from "zod";
import { zodErrorMap } from "../utils";

const configZod = () => {
  z.setErrorMap(zodErrorMap);
};

export default configZod;
