import Product from "../../models/Product";
import Dialog from "../ui/Dialog";

interface Props {
  product: Product;
  onUncheckProduct: () => void;
  onAddProduct: (productName: string) => void;
  onHideModal: () => void;
}

const ExistingProductDialog = ({
  product,
  onUncheckProduct,
  onAddProduct,
  onHideModal,
}: Props) => {
  const handleConfirm = (checked: boolean) => {
    if (checked) {
      onUncheckProduct();
    } else {
      onAddProduct(product.name);
    }
    onHideModal();
  };

  return (
    <Dialog
      text={
        product.isChecked
          ? `המוצר '${product.name}' כבר קיים במסומנים, האם להחזיר אותו לרשימה?`
          : `המוצר '${product.name}' כבר קיים ברשימה, האם להוסיף בכל זאת?`
      }
      onConfirm={() => handleConfirm(product.isChecked)}
      onCancel={onHideModal}
      confirmText={product.isChecked ? "להחזיר" : "להוסיף"}
      secondaryText={product.isChecked ? "להוסיף" : undefined}
      onSecondary={() => handleConfirm(false)}
    />
  );
};

export default ExistingProductDialog;
