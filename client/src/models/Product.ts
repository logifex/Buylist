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

export interface FilteredProducts {
  unChecked: Product[];
  checked: Product[];
}

export default Product;
