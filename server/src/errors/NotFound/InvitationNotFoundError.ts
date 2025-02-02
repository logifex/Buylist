import NotFoundError from "./NotFoundError";

class InvitationNotFoundError extends NotFoundError {
  message: string;

  constructor(message: string = "Invitation not found") {
    super(message);
    this.name = "InvitationNotFoundError";
    this.code = "INVITATION_NOT_FOUND";
    this.message = message;
  }
}

export default InvitationNotFoundError;
