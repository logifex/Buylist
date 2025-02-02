import List from "../models/List";

const grayGradient: readonly [string, string] = ["#757575", "#BDBDBD"];

const gradientMap = new Map<List["color"], readonly [string, string]>();
gradientMap.set("GRAY", grayGradient);
gradientMap.set("BROWN", ["#795548", "#8D6E63"]);
gradientMap.set("RED", ["#de001b", "#fe011f"]);
gradientMap.set("BLUE", ["#007cdd", "#019dfe"]);
gradientMap.set("GREEN", ["#009712", "#00d22a"]);
gradientMap.set("YELLOW", ["#fbb500", "#fee001"]);
gradientMap.set("PINK", ["#E91E63", "#F06292"]);

const getGradientColor = (color: List["color"]) => {
  return gradientMap.get(color) ?? grayGradient;
};

export default getGradientColor;
