import { Link, useNavigate, useParams } from "react-router";
import useGetList from "../hooks/api/lists/useGetList";
import ProductList from "../components/products/ProductList";
import ProductAddRow from "../components/products/ProductAddRow";
import useCreateProduct from "../hooks/api/products/useCreateProduct";
import useDeleteProduct from "../hooks/api/products/useDeleteProduct";
import Product from "../models/Product";
import useUpdateProduct from "../hooks/api/products/useUpdateProduct";
import { useCallback, useContext, useEffect } from "react";
import ModalContext from "../store/modal-context";
import useUpdateList from "../hooks/api/lists/useUpdateList";
import { ListInput } from "../models/List";
import useDeleteList from "../hooks/api/lists/useDeleteList";
import useLeaveList from "../hooks/api/lists/useLeaveList";
import ExistingProductDialog from "../components/products/ExistingProductDialog";
import Loading from "../components/ui/Loading";
import ListDetailsCard from "../components/lists/ListDetailsCard";
import { ApiError } from "../models/Error";
import ErrorCodes from "../constants/ErrorCodes";
import useListSocketHandlers from "../hooks/useListSocketHandlers";
import { toast } from "react-toastify";

const ProductsPage = () => {
  const { listId } = useParams() as { listId: string };

  const getList = useGetList({ listId: listId });
  const updateList = useUpdateList({ listId: listId });
  const deleteList = useDeleteList({ listId: listId });
  const leaveList = useLeaveList({ listId: listId });
  const createProduct = useCreateProduct({ listId: listId });
  const updateProduct = useUpdateProduct({ listId: listId });
  const deleteProduct = useDeleteProduct({ listId: listId });

  const { showModal, hideModal } = useContext(ModalContext);

  const navigate = useNavigate();

  const { data: list, refetch: refetchAsync } = getList;

  const refetch = useCallback(() => void refetchAsync(), [refetchAsync]);

  useListSocketHandlers(listId, refetch);

  useEffect(() => {
    if (list?.name) {
      document.title = `Buylist - ${list.name}`;
    }

    return () => {
      document.title = "Buylist - רשימת קניות שיתופית";
    };
  }, [list?.name]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    return () => {
      hideModal();
    };
  }, [hideModal]);

  const handleEditList = (listInput: ListInput) => {
    updateList.mutate({ list: listInput });
  };

  const handleDeleteList = async () => {
    try {
      await deleteList.mutateAsync();
      await navigate("/");
    } catch (err) {
      toast("שגיאה במחיקת רשימה");
      console.log((err as Error).message);
    }
  };

  const handleLeaveList = async () => {
    try {
      await leaveList.mutateAsync();
      await navigate("/");
    } catch (err) {
      toast("שגיאה בעזיבת רשימה");
      console.log((err as Error).message);
    }
  };

  const handleAddProduct = (productName: string) => {
    const existingProduct = list?.products
      .slice()
      .sort((p) => (p.isChecked ? 1 : -1))
      .find((p) => p.name === productName);
    if (existingProduct) {
      showModal({
        content: (
          <ExistingProductDialog
            product={existingProduct}
            onAddProduct={addProduct}
            onUncheckProduct={() => {
              handleEditProduct({ ...existingProduct, isChecked: false });
            }}
            onHideModal={hideModal}
          />
        ),
        title: "הוספת מוצר",
      });
      return;
    }

    addProduct(productName);
  };

  const addProduct = (productName: string) => {
    createProduct.mutate({ product: { name: productName } });
  };

  const { mutate: updateProductMutate } = updateProduct;
  const handleEditProduct = useCallback(
    (updatedProduct: Product) => {
      updateProductMutate({ product: updatedProduct });
    },
    [updateProductMutate]
  );

  const { mutate: deleteProductMutate } = deleteProduct;
  const handleDeleteProduct = useCallback(
    (productId: string) => {
      deleteProductMutate({ productId: productId });
    },
    [deleteProductMutate]
  );

  if (
    getList.error &&
    (getList.error as ApiError).error?.code === ErrorCodes.listNotFound
  ) {
    return (
      <div className="text-center text-lg font-semibold">
        <p className="text-black dark:text-white">
          הרשימה לא נמצאה.
          <br />
          ייתכן שהיא נמחקה או שאין לך הרשאה לראות אותה.
        </p>
        <Link className="text-blue-400" to="/">
          חזרה לעמוד הראשי
        </Link>
      </div>
    );
  }

  if (getList.error) {
    return (
      <p className="text-center text-lg font-semibold text-black dark:text-white">
        שגיאה בטעינת הרשימה.
      </p>
    );
  }

  if (!list) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto md:flex md:gap-4">
      <ListDetailsCard
        list={list}
        onEditList={handleEditList}
        onDeleteList={() => void handleDeleteList()}
        onLeaveList={() => void handleLeaveList()}
      />
      <div className="mx-auto max-w-md md:m-0 md:flex-1">
        <ProductAddRow onSubmit={handleAddProduct} />
        <ProductList
          products={list.products}
          color={list.color}
          onChange={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
