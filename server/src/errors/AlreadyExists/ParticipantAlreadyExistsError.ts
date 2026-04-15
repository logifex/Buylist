import AlreadyExistsError from "./AlreadyExistsError.js";

class ParticipantAlreadyExistsError extends AlreadyExistsError {
  message: string;

  constructor(message = "User is already a participant in the list") {
    super(message);
    this.name = "ParticipantAlreadyExistsError";
    this.code = "PARTICIPANT_ALREADY_EXISTS";
    this.message = message;
  }
}

export default ParticipantAlreadyExistsError;
