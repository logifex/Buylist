import { RefObject, useContext } from "react";
import ThemeContext, { ThemeStateType } from "../../store/theme-context";

interface Props {
  menuRef: RefObject<HTMLDivElement>;
  contextMenuOpen: boolean;
  closeMenu: () => void;
}

const ThemeContextMenu = ({ menuRef, contextMenuOpen, closeMenu }: Props) => {
  const { setPreferredTheme } = useContext(ThemeContext);

  const options: { value: ThemeStateType; text: string }[] = [
    { value: "light", text: "בהיר" },
    { value: "dark", text: "כהה" },
    { value: "default", text: "ברירת מחדל" },
  ];

  return (
    <div
      className={`${
        !contextMenuOpen ? "hidden " : ""
      }absolute left-0 mt-8 w-40 bg-gray-200 dark:bg-dark-main-800 rounded-md shadow-lg`}
      ref={menuRef}
    >
      <menu>
        {options.map((o) => (
          <li key={o.value}>
            <button
              className="block w-full text-center p-2 text-gray-600 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-dark-main-700 focus:outline-none rounded-md"
              type="button"
              onClick={() => {
                setPreferredTheme(o.value);
                closeMenu();
              }}
            >
              {o.text}
            </button>
          </li>
        ))}
      </menu>
    </div>
  );
};

export default ThemeContextMenu;
