import ParticipantModel from "../../models/Participant";

interface Props {
  participant: ParticipantModel;
  isUserOwner: boolean;
  onRemove: (userId: string) => void;
}

const Participant = ({ participant, isUserOwner, onRemove }: Props) => {
  const roleText = participant.role === "OWNER" ? "בעלים" : "משותף";

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div>
          <img
            className="size-10 rounded-full"
            src={participant.user.photoUrl ?? ""}
            alt="תמונת פרופיל"
          />
        </div>
        <div className="text-base text-gray-800 dark:text-gray-200">
          <p>{participant.user.name}</p>
          <p>{roleText}</p>
        </div>
      </div>
      {isUserOwner && participant.role !== "OWNER" && (
        <div>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black dark:bg-dark-main-600 dark:hover:bg-dark-main-700 dark:text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            type="button"
            onClick={() => onRemove(participant.user.id)}
          >
            הסרה
          </button>
        </div>
      )}
    </div>
  );
};

export default Participant;
