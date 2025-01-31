import React, { useState, useCallback } from "react";
import styled from "styled-components";

const PromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #000;
  color: #0f0;
  font-family: Consolas, monospace;
  padding: 10px;
`;

const OutputArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const InputArea = styled.div`
  display: flex;
  border-top: 1px solid #333;
  padding-top: 5px;
`;

const InputLabel = styled.span`
  margin-right: 5px;
`;

const InputField = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #0f0;
  outline: none;
  font-family: inherit;
  font-size: inherit;
`;

const CommandPrompt = ({ addNotification }) => {
  const [output, setOutput] = useState(["Welcome to the Command Prompt!"]);
  const [command, setCommand] = useState("");
  const prompt = "C:\\>";

  const handleSubmit = useCallback(() => {
    const trimmed = command.trim();
    const newOutput = [...output, `${prompt} ${trimmed}`];

    if (trimmed === "help") {
      newOutput.push("Available commands: help, echo, notify, clear");
    } else if (trimmed.startsWith("echo ")) {
      newOutput.push(trimmed.replace("echo ", ""));
    } else if (trimmed.startsWith("notify ")) {
      const message = trimmed.replace("notify ", "");
      if (addNotification) {
        addNotification(message);
      }
      newOutput.push(`Sent notification: "${message}"`);
    } else if (trimmed === "clear") {
      setOutput([]);
      setCommand("");
      return;
    } else if (trimmed) {
      newOutput.push("Unknown command. Type 'help' for a list of commands.");
    }

    setOutput(newOutput);
    setCommand("");
  }, [command, output, addNotification]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <PromptContainer>
      <OutputArea>
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </OutputArea>
      <InputArea>
        <InputLabel>{prompt}</InputLabel>
        <InputField
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </InputArea>
    </PromptContainer>
  );
};

export default CommandPrompt;
