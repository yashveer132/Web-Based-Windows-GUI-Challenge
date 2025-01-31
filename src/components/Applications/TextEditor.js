import { useState, useCallback } from "react";
import styled from "styled-components";

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Toolbar = styled.div`
  display: flex;
  padding: 5px;
  background-color: var(--window-bg);
  border-bottom: 1px solid var(--window-border);
`;

const Button = styled.button`
  margin-right: 5px;
  padding: 5px 10px;
  background-color: var(--button-bg);
  border: outset 2px var(--button-border);
  cursor: pointer;

  &:active {
    border-style: inset;
  }
`;

const TextArea = styled.textarea`
  flex: 1;
  resize: none;
  border: none;
  padding: 10px;
  font-family: "Courier New", Courier, monospace;
`;

const TextEditor = ({ createFile, fileSystem }) => {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("Untitled.txt");

  const handleSave = useCallback(() => {
    createFile("C:/Documents", fileName, text);
    console.log("File saved:", fileName);
  }, [createFile, fileName, text]);

  const handleFileNameChange = useCallback((e) => {
    setFileName(e.target.value);
  }, []);

  return (
    <EditorContainer>
      <Toolbar>
        <Button onClick={handleSave}>Save</Button>
        <input
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
