import React, { useState, useCallback } from "react";
import styled from "styled-components";

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 5px;
  padding: 5px;
  background-color: var(--window-title-inactive);
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: var(--button-bg);
  border: 1px solid var(--button-border);
  color: var(--text-color);
  cursor: pointer;

  &:hover {
    background-color: #4a4a4a;
  }

  &:active {
    opacity: 0.8;
  }
`;

const FileNameInput = styled.input`
  padding: 5px;
  background-color: #1e1e1e;
  border: 1px solid var(--window-border);
  color: var(--text-color);
`;

const TextArea = styled.textarea`
  flex: 1;
  resize: none;
  border: none;
  padding: 10px;
  font-family: "Segoe UI", sans-serif;
  color: var(--text-color);
  background-color: var(--window-bg);
`;

const TextEditor = ({ createFile, addNotification }) => {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("Untitled.txt");

  const handleSave = useCallback(() => {
    createFile("C:/Documents", fileName, text);
    if (addNotification) {
      addNotification(`File saved: ${fileName}`);
    }
  }, [createFile, fileName, text, addNotification]);

  const handleFileNameChange = useCallback((e) => {
    setFileName(e.target.value);
  }, []);

  const handlePrint = () => {
    if (addNotification) {
      addNotification(`Printing file: ${fileName} (simulation)`);
    }
  };

  return (
    <EditorContainer>
      <Toolbar>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handlePrint}>Print</Button>
        <FileNameInput
          type="text"
          value={fileName}
          onChange={handleFileNameChange}
          placeholder="File name"
        />
      </Toolbar>
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your text here..."
      />
    </EditorContainer>
  );
};

export default TextEditor;
