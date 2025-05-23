import ListList from "../components/lists/ListList";
import useGetLists from "../hooks/api/lists/useGetLists";
import { useCallback, useContext } from "react";
import ModalContext from "../store/modal-context";
import useCreateList from "../hooks/api/lists/useCreateList";
import CreateListModalContent from "../components/lists/CreateListModalContent";
import Loading from "../components/ui/Loading";
import ListContext from "../store/list-context";

const ListsPage = () => {
  const getLists = useGetLists();
  const createList = useCreateList();

  const modalContext = useContext(ModalContext);
  const { starList } = useContext(ListContext);

  const handleCreateList = (listName: string) => {
    createList.mutate({ list: { name: listName } });
  };

  const handleCreateButtonClick = () => {
    modalContext.showModal({
      content: (
        <CreateListModalContent
          hideModal={modalContext.hideModal}
          onAddList={handleCreateList}
        />
      ),
      title: "יצירת רשימה",
    });
  };

  const handleStarList = useCallback(
    (listId: string, star: boolean) => {
      starList(listId, star);
    },
    [starList]
  );

  if (getLists.error) {
    return (
      <p className="text-center text-lg font-semibold text-black dark:text-white">
        שגיאה בטעינת הרשימות.
      </p>
    );
  }

  if (!getLists.data) {
    return <Loading />;
  }

  return (
    <div className="max-w-md mx-auto">
      <button
        className="w-full mb-4 bg-primary-500 hover:bg-primary-600 text-black py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
        type="button"
        onClick={handleCreateButtonClick}
      >
        + יצירת רשימה
      </button>
      {getLists.data.length === 0 && (
        <p className="text-lg font-semibold text-center">אין רשימות.</p>
      )}
      {getLists.data.length > 0 && (
        <ListList lists={getLists.data} onStar={handleStarList} />
      )}
    </div>
  );
};

export default ListsPage;
