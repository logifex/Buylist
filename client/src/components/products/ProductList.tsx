import { useCallback, useContext } from "react";
import List from "../../models/List";
import ProductModel from "../../models/Product";
import filterProductsChecked from "../../utils/filterProductsChecked";
import Product from "./Product";
import ModalContext from "../../store/modal-context";
import EditProductModalContent from "./EditProductModalContent";

interface Props {
  products: ProductModel[];
  color: List["color"];
  onChange: (updatedProduct: ProductModel) => void;
  onDelete: (productId: string) => void;
}

const ProductList = ({ products, color, onChange, onDelete }: Props) => {
  const { showModal, hideModal } = useContext(ModalContext);

  const handleEditProductClick = useCallback(
    (product: ProductModel) => {
      showModal({
        content: (
          <EditProductModalContent
            product={product}
            hideModal={hideModal}
            onEditProduct={(productInput) =>
              onChange({
                note: null,
                isChecked: false,
                ...productInput,
                id: product.id,
              })
            }
          />
        ),
        title: "עריכת מוצר",
      });
    },
    [showModal, hideModal, onChange]
  );

  const renderProducts = (products: ProductModel[]) =>
    products.map((p) => (
      <li key={p.id}>
        <Product
          color={color}
          onChange={onChange}
          onDelete={onDelete}
          onEditClick={handleEditProductClick}
          {...p}
        />
      </li>
    ));

  const filteredProducts = filterProductsChecked(products);

  return (
    <div>
      <div>
        <ul className="space-y-1">
          {renderProducts(filteredProducts.unChecked)}
        </ul>
      </div>
      {filteredProducts.checked.length > 0 && (
        <div className="mt-4">
          <p className="mx-2 text-black dark:text-white">מסומנים</p>
          <ul className="space-y-1">
            {renderProducts(filteredProducts.checked)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductList;
