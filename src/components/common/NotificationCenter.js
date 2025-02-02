import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-50px);
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
  width: 300px;
  @media (max-width: 768px) {
    width: 80%;
    top: 10px;
  }
  @media (max-width: 480px) {
    width: 90%;
    top: 5px;
  }
`;

const NotificationBubble = styled.div`
  background-color: var(--notification-bg, #333);
  color: var(--notification-text, #fff);
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${slideDown} 0.5s ease forwards,
    ${slideUp} 0.5s ease forwards ${(props) => props.duration || 3}s;
  transition: background-color 0.3s ease;
  opacity: 1;
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
  @media (max-width: 480px) {
    padding: 10px 12px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--notification-text, #fff);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.2s ease;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const NotificationCenter = ({ notifications, removeNotification }) => {
  useEffect(() => {
    const timers = notifications.map((notification) =>
      setTimeout(
        () => removeNotification(notification.id),
        notification.duration || 3000
      )
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, removeNotification]);
  return (
    <NotificationContainer>
      {notifications.map((notification) => (
        <NotificationBubble
          key={notification.id}
          duration={notification.duration / 1000}
        >
          <span>{notification.message}</span>
          <CloseButton onClick={() => removeNotification(notification.id)}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </NotificationBubble>
      ))}
    </NotificationContainer>
  );
};

export default NotificationCenter;
