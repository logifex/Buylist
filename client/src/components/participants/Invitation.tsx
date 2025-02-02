import { IoLink } from "react-icons/io5";
import useCreateTokenInvitation from "../../hooks/api/invitations/useCreateTokenInvitation";
import useDeleteTokenInvitation from "../../hooks/api/invitations/useDeleteTokenInvitation";
import useGetTokenInvitation from "../../hooks/api/invitations/useGetTokenInvitation";
import { toast } from "react-toastify";

interface Props {
  listId: string;
}

const Invitation = ({ listId }: Props) => {
  const getTokenInvitation = useGetTokenInvitation({ listId: listId });
  const createTokenInvitation = useCreateTokenInvitation({ listId: listId });
  const deleteTokenInvitation = useDeleteTokenInvitation({ listId: listId });

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const link = getTokenInvitation.data
    ? `${serverUrl}/invite/${getTokenInvitation.data.token}`
    : undefined;
  const isExpired =
    getTokenInvitation.data?.expiry &&
    getTokenInvitation.data.expiry < new Date();

  const handleCopyLink = async () => {
    if (!link) {
      return;
    }

    await navigator.clipboard.writeText(link);
    toast.info("הקישור הועתק", {
      toastId: `copy-${link}`,
      icon: <IoLink color="#007bff" size={24} />,
    });
  };

  return (
    <div className="text-center">
      <h3 className="text-l font-semibold mb-4">הזמנה לרשימה</h3>
      {!getTokenInvitation.data && (
        <div>
          <button
            className="bg-primary-500 dark:bg-dark-main-700 text-black dark:text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-primary-600 dark:hover:bg-dark-main-600"
            type="button"
            disabled={
              createTokenInvitation.isPending || getTokenInvitation.isLoading
            }
            onClick={() => createTokenInvitation.mutate()}
          >
            {createTokenInvitation.isPending ? "טוען..." : "יצירת קישור הזמנה"}
          </button>
        </div>
      )}
      {link && (
        <div>
          {isExpired && <p className="text-red-500 mb-2">פג תוקף הקישור</p>}
          <div className="flex items-center w-full bg-gray-300 dark:bg-dark-main-600 py-2 px-4 rounded-md gap-x-2">
            <p className="text-gray-800 dark:text-gray-100 text-start break-all">
              {link}
            </p>
            <button type="button" onClick={() => void handleCopyLink()}>
              <IoLink color="#007bff" size={24} title="העתקת קישור" />
            </button>
          </div>
          <button
            className="text-red-500 mt-2"
            type="button"
            disabled={deleteTokenInvitation.isPending}
            onClick={() => deleteTokenInvitation.mutate()}
          >
            מחיקת קישור
          </button>
        </div>
      )}
    </div>
  );
};

export default Invitation;
