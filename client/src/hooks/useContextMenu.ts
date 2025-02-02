import { useEffect, useRef, useState } from "react";

const useContextMenu = (): [
  React.RefObject<HTMLDivElement>,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  React.RefObject<HTMLButtonElement>
] => {
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuOpen &&
        !menuRef.current?.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mouseup", handler);

    return () => {
      document.removeEventListener("mouseup", handler);
    };
  }, [btnRef, menuOpen]);

  return [menuRef, menuOpen, setMenuOpen, btnRef];
};

export default useContextMenu;
