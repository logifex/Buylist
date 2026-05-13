import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import ListContext, { type ListContextType } from "./list-context";

const ListProvider = ({ children }: PropsWithChildren) => {
  const [starredLists, setStarredLists] = useState<string[]>(() => {
    const starredListsJson = localStorage.getItem("starredLists");
    return (starredListsJson ? JSON.parse(starredListsJson) : []) as string[];
  });

  useEffect(() => {
    localStorage.setItem("starredLists", JSON.stringify(starredLists));
  }, [starredLists]);

  const handleStarList = useCallback((listId: string, star: boolean) => {
    if (!star) {
      setStarredLists((prevLists) => prevLists.filter((id) => id !== listId));
    } else {
      setStarredLists((prevLists) => [...prevLists, listId]);
    }
  }, []);

  const listsContext: ListContextType = {
    starredLists: starredLists,
    starList: handleStarList,
  };

  return <ListContext value={listsContext}>{children}</ListContext>;
};

export default ListProvider;
