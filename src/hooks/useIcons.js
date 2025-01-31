import { useState, useCallback } from "react";

export const useIcons = (initialIcons) => {
  const [icons, setIcons] = useState(initialIcons);

  const loadIconsFromLocalStorage = useCallback(() => {
    const savedIcons = localStorage.getItem("webos_icons");
    if (savedIcons) {
      setIcons(JSON.parse(savedIcons));
    }
  }, []);

  const saveIconsToLocalStorage = useCallback((iconsData) => {
    localStorage.setItem("webos_icons", JSON.stringify(iconsData));
  }, []);

  const moveIcon = useCallback((id, left, top) => {
    setIcons((prev) =>
      prev.map((icon) => (icon.id === id ? { ...icon, left, top } : icon))
    );
  }, []);

  const addIcon = useCallback((label, icon) => {
    const newIcon = {
      id: Date.now(),
      label,
      icon,
      left: 20,
      top: 20,
    };
    setIcons((prev) => [...prev, newIcon]);
  }, []);

  return {
    icons,
    moveIcon,
    addIcon,
    loadIconsFromLocalStorage,
    saveIconsToLocalStorage,
  };
};
