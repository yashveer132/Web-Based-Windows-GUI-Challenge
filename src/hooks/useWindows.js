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

  const getInitialSize = () => {
    if (typeof window === "undefined") return { width: 600, height: 400 };
    return window.innerWidth > 768
      ? { width: 600, height: 400 }
      : { width: "90%", height: "70%" };
  };

  const openWindow = useCallback((appId) => {
    setWindows((prev) => {
      const existingIndex = prev.findIndex((w) => w.appId === appId);
      const { width, height } = getInitialSize();
      
      if (existingIndex !== -1) {
        const existingWindow = prev[existingIndex];
        const updatedWindow = {
          ...existingWindow,
          isMinimized: false,
          isMaximized: window.innerWidth <= 768,
          x: 0,
          y: 0,
          width,
          height,
        };
        const newWindows = [...prev];
        newWindows[existingIndex] = updatedWindow;
        setActiveWindowId(existingWindow.id);
        return newWindows;
      } else {
        const newWindow = {
          id: Date.now(),
          appId,
          title: appId,
          x: window.innerWidth > 768 ? 40 : 0,
          y: window.innerWidth > 768 ? 30 : 0,
          width,
          height,
          isMinimized: false,
          isMaximized: window.innerWidth <= 768,
          prevState: null,
        };
        setActiveWindowId(newWindow.id);
        return [...prev, newWindow];
      }
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
      prev.map((window) => {
        if (window.id === id) {
          if (!window.isMaximized) {
            return {
              ...window,
              prevState: {
                x: window.x,
                y: window.y,
                width: window.width,
                height: window.height,
              },
              isMaximized: true,
              x: 0,
              y: 0,
              width: "100vw",
              height: "100vh",
            };
          } else {
            const { prevState } = window;
            return {
              ...window,
              isMaximized: false,
              x: prevState ? prevState.x : window.x,
              y: prevState ? prevState.y : window.y,
              width: prevState ? prevState.width : window.width,
              height: prevState ? prevState.height : window.height,
              prevState: null,
            };
          }
        }
        return window;
      })
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