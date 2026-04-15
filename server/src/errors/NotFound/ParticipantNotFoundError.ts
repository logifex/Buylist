import NotFoundError from "./NotFoundError.js";

class ParticipantNotFoundError extends NotFoundError {
  message: string;

  constructor(message = "Participant not found") {
    super(message);
    this.name = "ParticipantNotFoundError";
    this.code = "PARTICIPANT_NOT_FOUND";
    this.message = message;
  }
}

export default ParticipantNotFoundError;
