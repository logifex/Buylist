import Participant from "./Participant";
import Product, { ProductInput } from "./Product";

type ListColor =
  | "GRAY"
  | "BROWN"
  | "RED"
  | "BLUE"
  | "GREEN"
  | "YELLOW"
  | "PINK";

export interface ListInput {
  name: string;
  color?: ListColor;
  products?: ProductInput[];
}

export interface ListPreview {
  id: string;
  name: string;
}

export interface ListInfo {
  id: string;
  name: string;
  color: ListColor;
}

interface List extends ListInfo {
  products: Product[];
  participants: Participant[];
}

export default List;
