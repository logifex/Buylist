import React from "react";

export interface ListContextType {
  starredLists: string[];
  starList: (listId: string, star: boolean) => void;
}

const ListContext = React.createContext<ListContextType>({
  starredLists: [],
  starList: () => {
    return;
  },
});

export default ListContext;
