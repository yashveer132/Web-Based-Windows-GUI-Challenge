import React, { useState, useCallback } from "react";
import styled from "styled-components";

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #1e1e1e;
  color: #ffffff;
  font-family: "Segoe UI", sans-serif;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #333333;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #4a90e2;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ab7;
  }
`;

const FileNameInput = styled.input`
  padding: 10px;
  border: 1px solid #555;
  background-color: #2a2a2a;
  color: #ffffff;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  width: 600px;
  height: 300px;
  padding: 15px;
  border: 1px solid #555;
  border-radius: 5px;
  background-color: #2a2a2a;
  color: #ffffff;
  font-size: 1rem;
  resize: none;
`;

const Footer = styled.div`
  margin-top: 10px;
  font-size: 1rem;
  color: #cccccc;
`;

const PrintPreviewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const PrintPreviewContent = styled.div`
  background-color: #1c1c1c;
  color: white;
  padding: 20px;
  width: 400px;
  height: 400px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PrintContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
  white-space: pre-wrap;
  text-align: left;
`;

const PrintPreviewCloseButton = styled(Button)`
  background-color: #d9534f;

  &:hover {
    background-color: #c9302c;
  }
`;

const PrintButton = styled(Button)`
  background-color: #5cb85c;

  &:hover {
    background-color: #4cae4c;
  }
`;

const PrintSimulation = styled.div`
  background-color: #000;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  font-size: 1.5rem;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const TextEditor = ({ createFile, addNotification }) => {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("Untitled.txt");
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showPrintSimulation, setShowPrintSimulation] = useState(false);

  const handleSave = useCallback(() => {
    createFile("C:/Documents", fileName, text);
    if (addNotification) {
      addNotification(`File saved: ${fileName}`);
    }
  }, [createFile, fileName, text, addNotification]);

  const handleFileNameChange = useCallback((e) => {
    setFileName(e.target.value);
  }, []);

  const handlePrintPreview = () => {
    setShowPrintPreview(true);
  };

  const handlePrint = () => {
    setShowPrintSimulation(true);
    if (addNotification) {
      addNotification(`Printing: ${fileName}`);
    }
    setTimeout(() => {
      setShowPrintSimulation(false);
      setShowPrintPreview(false);
      if (addNotification) {
        addNotification(`Printing completed for: ${fileName}`);
      }
    }, 3000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
  const charCount = text.length;

  return (
    <EditorContainer>
      <Toolbar>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handlePrintPreview}>Print Preview</Button>
        <Button onClick={handleDownloadFile}>Download File</Button>
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

      <Footer>
        Word Count: {wordCount} | Character Count: {charCount}
      </Footer>

      {showPrintPreview && (
        <PrintPreviewOverlay>
          <PrintPreviewContent>
            <h2>Print Preview - {fileName}</h2>
            <PrintContent>{text}</PrintContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "15px",
              }}
            >
              <PrintButton onClick={handlePrint}>Print</PrintButton>
              <PrintPreviewCloseButton
                onClick={() => setShowPrintPreview(false)}
              >
                Close
              </PrintPreviewCloseButton>
            </div>
          </PrintPreviewContent>
        </PrintPreviewOverlay>
      )}

      {showPrintSimulation && (
        <PrintSimulation show={showPrintSimulation}>
          <p>🖨️ Printing in progress...</p>
        </PrintSimulation>
      )}
    </EditorContainer>
  );
};

export default TextEditor;
