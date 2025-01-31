import { useState, useCallback } from "react";

export const useWindows = () => {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);

  const openWindow = useCallback((appId) => {
    const newWindow = {
      id: Date.now(),
      appId,
      title: appId,
      x: 50,
      y: 50,
      width: 400,
      height: 300,
      isMinimized: false,
    };
    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
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
  };
};
