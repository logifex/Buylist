import AlreadyExistsError from "./AlreadyExistsError.js";

class InvitationAlreadyExistsError extends AlreadyExistsError {
  message: string;

  constructor(message = "List already has an invitation") {
    super(message);
    this.name = "InvitationAlreadyExistsError";
    this.code = "INVITATION_ALREADY_EXISTS";
    this.message = message;
  }
}

export default InvitationAlreadyExistsError;
