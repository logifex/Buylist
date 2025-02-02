import { NextFunction, Request, Response } from "express";
import {
  CreateListInput,
  EditListInput,
  FullList,
  ListDetails,
  ListIdParam,
  ListPreview,
} from "../types/list";
import { InviteTokenParam } from "../types/invitation";
import { InvitationService, ListService } from "../services";
import { assertUser } from "../utils";
import { InvitationNotFoundError, ListNotFoundError } from "../errors";

const getLists = async (
  req: Request,
  res: Response<FullList[]>,
  next: NextFunction
) => {
  const user = assertUser(req.user);
  const lists = await ListService.getUserLists(user.id);

  res.status(200).json(lists);
};

const getList = async (
  req: Request<ListIdParam, {}, {}>,
  res: Response<FullList>,
  next: NextFunction
) => {
  const { listId } = req.params;
  const list = await ListService.getList(listId);

  if (!list) {
    return next(new ListNotFoundError());
  }

  res.status(200).json(list);
};

const postList = async (
  req: Request<{}, {}, CreateListInput>,
  res: Response<FullList>,
  next: NextFunction
) => {
  const user = assertUser(req.user);
  const list = req.body;
  const newList = await ListService.createList(list, user.id);

  res.status(201).json(newList);
};

const patchList = async (
  req: Request<ListIdParam, {}, EditListInput>,
  res: Response<ListDetails>,
  next: NextFunction
) => {
  const { listId } = req.params;
  const listInput = req.body;
  const updatedList = await ListService.editList(listId, listInput);

  res.status(200).json(updatedList);
};

const deleteList = async (
  req: Request<ListIdParam, {}, {}>,
  res: Response<{}>,
  next: NextFunction
) => {
  const { listId } = req.params;
  await ListService.deleteList(listId);

  res.status(204).send();
};

const getJoinList = async (
  req: Request<InviteTokenParam, {}, {}>,
  res: Response<ListPreview>,
  next: NextFunction
) => {
  const { inviteToken: token } = req.params;

  const listInfo = await InvitationService.getListInfoFromInviteToken(token);

  if (!listInfo) {
    return next(new InvitationNotFoundError());
  }

  res.status(200).json(listInfo);
};

const postJoinList = async (
  req: Request<InviteTokenParam, {}, {}>,
  res: Response<FullList>,
  next: NextFunction
) => {
  const user = assertUser(req.user);
  const { inviteToken: token } = req.params;

  const listId = await InvitationService.joinListFromInviteToken(
    token,
    user.id
  );
  const list = await ListService.getList(listId);

  if (!list) {
    return next(new ListNotFoundError());
  }

  res.status(201).json(list);
};

export default {
  getLists,
  getList,
  postList,
  patchList,
  deleteList,
  getJoinList,
  postJoinList,
};
