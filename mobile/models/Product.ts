export interface ProductInput {
  name: string;
  note?: string | null;
  isChecked?: boolean;
}

export interface Product {
  id: string;
  name: string;
  note: string | null;
  isChecked: boolean;
}

export interface SharedProduct extends Product {
  isSynced?: boolean;
}

export interface FilteredProducts {
  unChecked: Product[];
  checked: Product[];
}
