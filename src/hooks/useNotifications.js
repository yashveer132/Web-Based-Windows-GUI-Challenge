/**
 * Custom hook for managing notifications in an application.
 * Provides methods to add and remove notifications with optional timeout-based dismissal.
 *
 * Key Features:
 * - Dynamically add notifications with unique IDs.
 * - Automatically remove notifications after a specified duration (default: 5000ms).
 * - Manual removal of notifications is also supported.
 */

import { useState, useCallback } from "react";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, duration = 5000) => {
    const id = Date.now();
    const newNotification = { id, message, duration };
    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => removeNotification(id), duration);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};
