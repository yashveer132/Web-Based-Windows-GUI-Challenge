/**
 * Custom hook for managing a dynamic desktop icon system.
 * Provides functionalities to load, save, move, and add icons with persistent state storage.
 *
 * Key Features:
 * - Load and save icon positions to localStorage for state persistence.
 * - Dynamically add new icons with unique IDs and default positions.
 * - Move icons by updating their positions (left, top).
 */

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
