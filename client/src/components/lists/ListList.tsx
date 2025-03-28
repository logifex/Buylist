import ListModel from "../../models/List";
import List from "./List";
import { useContext } from "react";
import ListContext from "../../store/list-context";

interface Props {
  lists: ListModel[];
  onStar: (listId: string, star: boolean) => void;
}

const ListList = ({ lists, onStar }: Props) => {
  const { starredLists } = useContext(ListContext);

  const sortedLists = lists.slice().sort((a, b) => {
    const indexA = starredLists.indexOf(a.id);
    const indexB = starredLists.indexOf(b.id);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    } else {
      return indexB - indexA;
    }
  });

  return (
    <ul className="space-y-4">
      {sortedLists.map((l) => (
        <li key={l.id}>
          <List
            list={l}
            isStarred={starredLists.includes(l.id)}
            onStar={onStar}
          />
        </li>
      ))}
    </ul>
  );
};

export default ListList;
