import { List, SharedList } from "@/models/List";

function isSharedList(list: List): list is SharedList {
  return "participants" in list;
}

export default isSharedList;
