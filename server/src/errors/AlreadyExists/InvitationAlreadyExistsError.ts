import AlreadyExistsError from "./AlreadyExistsError";

class InvitationAlreadyExistsError extends AlreadyExistsError {
  message: string;

  constructor(message: string = "List already has an invitation") {
    super(message);
    this.name = "InvitationAlreadyExistsError";
    this.code = "INVITATION_ALREADY_EXISTS";
    this.message = message;
  }
}

export default InvitationAlreadyExistsError;
