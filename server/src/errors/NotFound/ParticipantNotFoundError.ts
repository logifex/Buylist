import NotFoundError from "./NotFoundError";

class ParticipantNotFoundError extends NotFoundError {
  message: string;

  constructor(message: string = "Participant not found") {
    super(message);
    this.name = "ParticipantNotFoundError";
    this.code = "PARTICIPANT_NOT_FOUND";
    this.message = message;
  }
}

export default ParticipantNotFoundError;
