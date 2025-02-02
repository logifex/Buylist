import { RefObject, useContext } from "react";
import AuthContext from "../../store/auth-context";

interface Props {
  menuRef: RefObject<HTMLDivElement>;
  contextMenuOpen: boolean;
  closeMenu: () => void;
}

const ProfileContextMenu = ({ menuRef, contextMenuOpen, closeMenu }: Props) => {
  const { signOut, userInfo } = useContext(AuthContext);

  const handleSignOutClick = () => {
    void signOut();
    closeMenu();
  };

  return (
    <div
      className={`${
        !contextMenuOpen ? "hidden " : ""
      }absolute left-0 mt-6 w-80 bg-gray-200 dark:bg-dark-main-800 rounded-md shadow-lg p-4`}
      ref={menuRef}
    >
      <div className="space-y-2">
        <div className="flex flex-col items-center">
          <img
            className="size-24 rounded-full"
            src={userInfo?.photoUrl ?? ""}
            alt="תמונת פרופיל"
          />
          <div className="mt-2 text-center">
            <p className="text-black dark:text-white font-bold">
              {userInfo?.name}
            </p>
            <p className="text-black dark:text-white">{userInfo?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOutClick}
          className="block w-full text-center p-2 text-gray-600 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-dark-main-700 focus:outline-none rounded-md"
        >
          התנתקות
        </button>
      </div>
    </div>
  );
};

export default ProfileContextMenu;
