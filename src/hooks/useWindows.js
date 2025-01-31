import { useState, useCallback, useEffect } from "react";

export const useWindows = () => {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null);

  useEffect(() => {
    if (currentUsername) {
      loadWindowsFromLocalStorage(currentUsername);
    } else {
      setWindows([]);
      setActiveWindowId(null);
    }
  }, [currentUsername]);

  const loadWindowsFromLocalStorage = useCallback((username) => {
    const savedKey = `webos_windows_${username}`;
    const savedWindows = localStorage.getItem(savedKey);
    if (savedWindows) {
      const parsed = JSON.parse(savedWindows);
      setWindows(parsed);
      if (parsed.length > 0) {
        setActiveWindowId(parsed[parsed.length - 1].id);
      } else {
        setActiveWindowId(null);
      }
    } else {
      setWindows([]);
      setActiveWindowId(null);
    }
  }, []);

  const saveWindowsToLocalStorage = useCallback(() => {
    if (!currentUsername) return;
    const savedKey = `webos_windows_${currentUsername}`;
    localStorage.setItem(savedKey, JSON.stringify(windows));
  }, [currentUsername, windows]);

  useEffect(() => {
    saveWindowsToLocalStorage();
  }, [windows, saveWindowsToLocalStorage]);

  const setUser = useCallback((username) => {
    setCurrentUsername(username || null);
  }, []);

  const openWindow = useCallback((appId) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.appId === appId && !w.isMinimized);
      if (existing) {
        setActiveWindowId(existing.id);
        return prev;
      }
      const newWindow = {
        id: Date.now(),
        appId,
        title: appId,
        x: 50,
        y: 50,
        width: 600,
        height: 400,
        isMinimized: false,
        isMaximized: false,
      };
      return [...prev, newWindow];
    });
  }, []);

  const closeWindow = useCallback(
    (id) => {
      setWindows((prev) => prev.filter((window) => window.id !== id));
      if (activeWindowId === id) {
        setActiveWindowId(null);
      }
    },
    [activeWindowId]
  );

  const minimizeWindow = useCallback((id) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, isMinimized: true } : window
      )
    );
    setActiveWindowId(null);
  }, []);

  const maximizeWindow = useCallback((id) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? { ...window, isMaximized: !window.isMaximized }
          : window
      )
    );
  }, []);

  const focusWindow = useCallback((id) => {
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, isMinimized: false } : window
      )
    );
  }, []);

  return {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    setUser,
  };
};
