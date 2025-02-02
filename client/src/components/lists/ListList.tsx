import { Link } from "react-router";
import ListModel from "../../models/List";
import List from "./List";

interface Props {
  lists: ListModel[];
}

const ListList = ({ lists }: Props) => {
  return (
    <ul className="space-y-4">
      {lists.map((l) => (
        <li key={l.id}>
          <Link className="block" to={`/lists/${l.id}`}>
            <List list={l} />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ListList;
