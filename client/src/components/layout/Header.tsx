import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import { Link } from "react-router";
import LoginButton from "../ui/LoginButton";
import ProfileContextMenu from "./ProfileContextMenu";
import ThemeContextMenu from "./ThemeContextMenu";
import ThemeContext from "../../store/theme-context";
import { IoMoon, IoSunny } from "react-icons/io5";
import useContextMenu from "../../hooks/useContextMenu";

const Header = () => {
  const { userInfo, ready } = useContext(AuthContext);

  const [profileMenuRef, profileMenuOpen, setProfileMenuOpen, profileBtnRef] =
    useContextMenu();
  const [themeMenuRef, themeMenuOpen, setThemeMenuOpen, themeBtnRef] =
    useContextMenu();

  const { currentColorSchemeName } = useContext(ThemeContext);

  return (
    <header className="bg-primary-500 dark:bg-dark-main-800 p-4 shadow-lg flex justify-between fixed w-full top-0">
      <Link to="/">
        <h1 className="text-2xl font-bold text-start text-b text-black dark:text-white">
          Buylist
        </h1>
      </Link>
      <div className="flex gap-6 items-center">
        <div className="relative">
          <button
            ref={themeBtnRef}
            className="block"
            type="button"
            onClick={() => setThemeMenuOpen((s) => !s)}
          >
            {currentColorSchemeName === "dark" ? (
              <IoMoon size={22} title="שינוי ערכת נושא" />
            ) : (
              <IoSunny size={22} color="black" title="שינוי ערכת נושא" />
            )}
          </button>
          <ThemeContextMenu
            menuRef={themeMenuRef}
            contextMenuOpen={themeMenuOpen}
            closeMenu={() => setThemeMenuOpen(false)}
          />
        </div>
        {userInfo && (
          <div className="relative">
            <button
              ref={profileBtnRef}
              className="block"
              type="button"
              onClick={() => setProfileMenuOpen((s) => !s)}
            >
              <img
                alt="פרופיל"
                title="פרופיל"
                src={userInfo.photoUrl ?? ""}
                className="rounded-full size-8 border-2 border-black dark:border-white"
              />
            </button>
            <ProfileContextMenu
              menuRef={profileMenuRef}
              contextMenuOpen={profileMenuOpen}
              closeMenu={() => setProfileMenuOpen(false)}
            />
          </div>
        )}
        {ready && !userInfo && <LoginButton />}
      </div>
    </header>
  );
};

export default Header;
