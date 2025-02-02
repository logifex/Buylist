export interface ProductInput {
  name: string;
  note?: string | null;
  isChecked?: boolean;
}

interface Product {
  id: string;
  name: string;
  note: string | null;
  isChecked: boolean;
}

export interface SharedProduct extends Product {
  isSynced?: boolean;
}

export type FilteredProducts = {
  unChecked: Product[];
  checked: Product[];
};

export default Product;
