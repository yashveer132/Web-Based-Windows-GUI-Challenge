import React from "react";
import styled from "styled-components";

const NotificationContainer = styled.div`
  position: absolute;
  bottom: 50px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 9999;

  @media (max-width: 600px) {
    bottom: 70px; /* adjust if needed for smaller screens */
  }
`;

const NotificationBubble = styled.div`
  background-color: var(--notification-bg);
  color: var(--notification-text);
  padding: 10px 15px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
`;

const NotificationCenter = ({ notifications }) => {
  return (
    <NotificationContainer>
      {notifications.map((notification) => (
        <NotificationBubble key={notification.id}>
          {notification.message}
        </NotificationBubble>
      ))}
    </NotificationContainer>
  );
};

export default NotificationCenter;
