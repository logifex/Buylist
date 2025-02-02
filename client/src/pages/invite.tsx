import { Link, useNavigate, useParams } from "react-router";
import useJoinList from "../hooks/api/invitations/useJoinList";
import { useCallback, useContext, useEffect, useState } from "react";
import InvitationService from "../services/InvitationService";
import Dialog from "../components/ui/Dialog";
import ModalContext from "../store/modal-context";
import { ApiError } from "../models/Error";
import Loading from "../components/ui/Loading";
import ErrorCodes from "../constants/ErrorCodes";
import { toast } from "react-toastify";

const InvitePage = () => {
  const { token } = useParams() as { token: string };

  const navigate = useNavigate();
  const joinList = useJoinList();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError>();

  const { showModal, hideModal } = useContext(ModalContext);

  const handleClose = useCallback(async () => {
    hideModal();
    await navigate("/");
  }, [navigate, hideModal]);

  const { mutateAsync } = joinList;
  const handleJoin = useCallback(async () => {
    try {
      await mutateAsync({ token });
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.error?.code === ErrorCodes.invitationNotFound) {
        toast.error("קישור ההזמנה כבר לא קיים");
      } else if (apiError.error?.code === ErrorCodes.participantAlreadyExists) {
        toast.error("משתמש זה כבר נמצא ברשימה זו");
      } else {
        console.error(err);
        toast.error("שגיאה בהצטרפות לרשימה");
      }
    } finally {
      await handleClose();
    }
  }, [mutateAsync, token, handleClose]);

  useEffect(() => {
    const fetchListPreview = async () => {
      try {
        const preview = await InvitationService.getInvitationList(token);
        showModal({
          title: "הצטרפות לרשימה",
          canClose: false,
          showClose: false,
          content: (
            <Dialog
              onConfirm={() => void handleJoin()}
              onCancel={() => {
                void handleClose();
              }}
              text={`הוזמנת לרשימה '${preview.name}'\nהאם להצטרף לרשימה הזו?`}
            />
          ),
        });
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    };

    void fetchListPreview();
  }, [showModal, token, handleJoin, handleClose]);

  if (error) {
    return (
      <div className="text-center text-lg font-semibold">
        <p className="text-black dark:text-white">
          {error.error?.code === ErrorCodes.invitationNotFound
            ? "ההזמנה לא קיימת. יכול להיות שפג תוקפה."
            : "שגיאה בטעינת ההזמנה."}
        </p>
        <Link className="text-blue-400" to="/">
          חזרה לעמוד הראשי
        </Link>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return <></>;
};

export default InvitePage;
