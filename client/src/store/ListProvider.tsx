import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import ListContext, { ListContextType } from "./list-context";

const ListProvider = ({ children }: PropsWithChildren) => {
  const [starredLists, setStarredLists] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const starredListsJson = localStorage.getItem("starredLists");
    const storedStarredLists = (
      starredListsJson ? JSON.parse(starredListsJson) : []
    ) as string[];

    setStarredLists(storedStarredLists);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("starredLists", JSON.stringify(starredLists));
    }
  }, [starredLists, loaded]);

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
