import type { List } from "../models/List";

const Gradients: Record<List["color"], readonly [string, string]> = {
  GRAY: ["#757575", "#BDBDBD"],
  BROWN: ["#795548", "#8D6E63"],
  RED: ["#de001b", "#fe011f"],
  BLUE: ["#007cdd", "#019dfe"],
  GREEN: ["#009712", "#00d22a"],
  YELLOW: ["#fbb500", "#fee001"],
  PINK: ["#E91E63", "#F06292"],
};

export default Gradients;
