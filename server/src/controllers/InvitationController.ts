import { NextFunction, Request, Response } from "express";
import { isbot } from "isbot";
import { ListIdParam } from "../types/list";
import { InviteTokenParam, TokenInvitationDetails } from "../types/invitation";
import { InvitationService } from "../services";
import { encodeUuidToBase64Url } from "../utils";
import { InvitationNotFoundError } from "../errors";
import { env } from "../config";

const getInviteToken = async (
  req: Request<ListIdParam, {}, {}>,
  res: Response<TokenInvitationDetails>,
  next: NextFunction
) => {
  const { listId } = req.params;

  const invitation = await InvitationService.getTokenInvitationByList(listId);

  if (!invitation) {
    return next(new InvitationNotFoundError());
  }

  const shortenedToken = encodeUuidToBase64Url(invitation.token);
  res.status(200).json({ ...invitation, token: shortenedToken });
};

const postInviteToken = async (
  req: Request<ListIdParam, {}, {}>,
  res: Response<TokenInvitationDetails>,
  next: NextFunction
) => {
  const { listId } = req.params;

  const invitation = await InvitationService.createTokenInvitation(listId);
  const shortenedToken = encodeUuidToBase64Url(invitation.token);

  res.status(201).json({ ...invitation, token: shortenedToken });
};

const deleteInviteToken = async (
  req: Request<ListIdParam, {}, {}>,
  res: Response<{}>,
  next: NextFunction
) => {
  const { listId } = req.params;

  await InvitationService.deleteTokenInvitationByList(listId);

  res.status(204).send();
};

const getInvitePage = async (
  req: Request<InviteTokenParam, {}, {}>,
  res: Response<{}>,
  next: NextFunction
) => {
  const { inviteToken: token } = req.params;
  const userAgent = req.headers["user-agent"];

  if (isbot(userAgent)) {
    const listInfo = await InvitationService.getListInfoFromInviteToken(token);
    if (listInfo) {
      const title = `${listInfo.name} - Buylist`;
      const description = `You were invited to the list '${listInfo.name}' in Buylist!`;
      return res.type("html").send(
        `<html>
          <head>
            <meta property="og:title" content="${title}" /> 
            <meta property="og:description" content="${description}" />
            <title>${title}</title>
          </head>
        </html>`
      );
    }
  }

  const encodedToken = encodeUuidToBase64Url(token);
  const clientUrl = env.clientUrl;
  res.redirect(`${clientUrl}/invite/${encodedToken}`);
};

export default {
  getInviteToken,
  postInviteToken,
  deleteInviteToken,
  getInvitePage,
};
