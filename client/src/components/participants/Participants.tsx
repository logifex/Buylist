import { useCallback, useContext, useEffect } from "react";
import ParticipantModel from "../../models/Participant";
import Participant from "./Participant";
import AuthContext from "../../store/auth-context";
import useGetParticipants from "../../hooks/api/participants/useGetParticipants";
import List from "../../models/List";
import useRemoveParticipant from "../../hooks/api/participants/useRemoveParticipant";
import ListQueryKeys from "../../constants/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";
import Invitation from "./Invitation";

interface Props {
  list: List;
}

const Participants = ({ list }: Props) => {
  const { userInfo: currentUser } = useContext(AuthContext);

  const getParticipants = useGetParticipants({ listId: list.id });
  const removeParticipant = useRemoveParticipant({ listId: list.id });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (getParticipants.data) {
      queryClient.setQueryData(
        ListQueryKeys.detail(list.id),
        (prevList: List | undefined) =>
          prevList && { ...prevList, participants: getParticipants.data }
      );
    }
  }, [getParticipants.data, list.id, queryClient]);

  const isUserOwner = list.participants[0].user.id === currentUser?.id;

  const currentUserParticipant: ParticipantModel | undefined = currentUser && {
    role: isUserOwner ? "OWNER" : "BASIC",
    user: {
      id: currentUser.id,
      name: "את/ה",
      photoUrl: currentUser.photoUrl,
    },
  };

  const participants: ParticipantModel[] = [];
  if (getParticipants.data && currentUserParticipant) {
    const otherParticipants = getParticipants.data.filter(
      (p) => p.user.id !== currentUserParticipant.user.id
    );
    participants.push(...[currentUserParticipant, ...otherParticipants]);
  }

  const { mutate: mutateRemoveParticipant } = removeParticipant;
  const handleRemoveParticipant = useCallback(
    (userId: string) => {
      mutateRemoveParticipant({ participantId: userId });
    },
    [mutateRemoveParticipant]
  );

  return (
    <div>
      <ul className="space-y-2 mb-2">
        {participants.map((p) => (
          <li key={p.user.id}>
            <Participant
              participant={p}
              isUserOwner={isUserOwner}
              onRemove={handleRemoveParticipant}
            />
          </li>
        ))}
      </ul>
      <Invitation listId={list.id} />
    </div>
  );
};

export default Participants;
