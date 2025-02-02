import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1e1e2f;
  color: #ffffff;
  height: 100vh;
  padding: 20px;
  font-family: "Arial, sans-serif";
  @media (max-width: 768px) {
    padding: 15px;
  }
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Instructions = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
  color: #aaaaaa;
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ClipboardList = styled.ul`
  flex: 1;
  width: 100%;
  max-width: 400px;
  overflow-y: auto;
  margin-top: 10px;
  list-style-type: none;
  padding: 0;
  @media (max-width: 768px) {
    max-width: 95%;
  }
  @media (max-width: 480px) {
    max-width: 90vw;
  }
`;

const ClipboardItem = styled.li`
  background-color: #2d2d3e;
  color: #ffffff;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
  animation: fadeIn 0.4s ease-in;

  &:hover {
    background-color: #3a3a52;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 8px;
  }
  @media (max-width: 480px) {
    padding: 6px;
    font-size: 0.9rem;
  }
`;

const ClearButton = styled.button`
  background-color: #ff5757;
  color: white;
  padding: 10px 15px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 40px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff1e1e;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
`;

export default function ClipboardManager({ addNotification }) {
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("clipboardHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem("clipboardHistory", JSON.stringify(history));
  }, [history]);

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

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("clipboardHistory");
  };

  const handleItemClick = (item) => {
    navigator.clipboard.writeText(item);
    if (addNotification) {
      addNotification(`Copied back to clipboard: ${item}`);
    }
  };

  return (
    <ManagerContainer>
      <Title>📋Clipboard Manager</Title>
      <Instructions>
        Copy text with Ctrl+C then check below. Click an item to copy it back!
      </Instructions>
      <ClipboardList>
        {history.map((item, idx) => (
          <ClipboardItem key={idx} onClick={() => handleItemClick(item)}>
            {item}
          </ClipboardItem>
        ))}
      </ClipboardList>
      {history.length > 0 && (
        <ClearButton onClick={handleClearHistory}>
          Clear Clipboard History
        </ClearButton>
      )}
    </ManagerContainer>
  );
}
