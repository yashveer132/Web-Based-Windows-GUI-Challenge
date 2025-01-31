import { useState, useCallback } from "react";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message) => {
    const newNotification = {
      id: Date.now(),
      message,
    };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      setNotifications((prevState) =>
        prevState.filter((n) => n.id !== newNotification.id)
      );
    }, 5000);
  }, []);

  return {
    notifications,
    addNotification,
  };
};
