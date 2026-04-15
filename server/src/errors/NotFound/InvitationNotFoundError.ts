import NotFoundError from "./NotFoundError.js";

class InvitationNotFoundError extends NotFoundError {
  message: string;

  constructor(message = "Invitation not found") {
    super(message);
    this.name = "InvitationNotFoundError";
    this.code = "INVITATION_NOT_FOUND";
    this.message = message;
  }
}

export default InvitationNotFoundError;
