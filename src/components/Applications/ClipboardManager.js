import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--window-bg);
  color: var(--text-color);
  height: 100%;
  padding: 10px;
`;

const ClipboardList = styled.ul`
  flex: 1;
  overflow-y: auto;
  margin-top: 10px;
`;

const ClipboardItem = styled.li`
  margin-bottom: 5px;
  background-color: var(--taskbar-button-active);
  padding: 5px;
`;

export default function ClipboardManager({ addNotification }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const handleCopy = (e) => {
      let text = "";
      if (document.getSelection) {
        text = document.getSelection().toString();
      }
      if (!text && e.clipboardData) {
        text = e.clipboardData.getData("text/plain");
      }
      if (text) {
        setHistory((prev) => [text, ...prev]);
        if (addNotification) {
          addNotification(`Copied: ${text}`);
        }
      }
    };

    document.addEventListener("copy", handleCopy);
    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, [addNotification]);

  return (
    <ManagerContainer>
      <h2>Clipboard Manager</h2>
      <p>Copy text with Ctrl+C or right-click → Copy, then check below.</p>
      <ClipboardList>
        {history.map((item, idx) => (
          <ClipboardItem key={idx}>{item}</ClipboardItem>
        ))}
      </ClipboardList>
    </ManagerContainer>
  );
}
