import React, { useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

const PromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #1e1e2f;
  color: #0f0;
  font-family: "Fira Code", monospace;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.5);
  @media (max-width: 768px) {
    padding: 12px;
  }
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const OutputArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding-right: 5px;
  border: 1px solid #333;
  padding: 10px;
  border-radius: 5px;
  background-color: #111;
  @media (max-width: 768px) {
    padding: 8px;
  }
  @media (max-width: 480px) {
    padding: 6px;
  }
`;

const InputArea = styled.div`
  display: flex;
  border-top: 1px solid #333;
  padding-top: 5px;
`;

const InputLabel = styled.span`
  margin-right: 5px;
  color: #0fa;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const InputField = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #0f0;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const SuggestionBox = styled.div`
  background: #222;
  color: #0f0;
  padding: 5px 10px;
  margin-top: 5px;
  border-radius: 5px;
  max-height: 100px;
  overflow-y: auto;
  margin-left: 20px;
  @media (max-width: 768px) {
    margin-left: 15px;
    padding: 4px 8px;
  }
  @media (max-width: 480px) {
    margin-left: 10px;
    padding: 4px 6px;
  }
`;

const CommandListContainer = styled.div`
  background: #111;
  color: #0fa;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  font-size: 14px;
  ul {
    margin-left: 20px;
  }
  @media (max-width: 768px) {
    padding: 8px;
    font-size: 12px;
    ul {
      margin-left: 15px;
    }
  }
  @media (max-width: 480px) {
    padding: 6px;
    font-size: 11px;
    ul {
      margin-left: 10px;
    }
  }
`;

const commandsInfo = [
  { command: "help", description: "Lists available commands" },
  { command: "echo [message]", description: "Displays the message" },
  { command: "notify [message]", description: "Sends a notification" },
  { command: "clear", description: "Clears the screen" },
  { command: "time", description: "Displays the current time" },
  { command: "list", description: "Lists all commands and their descriptions" },
];

const CommandPrompt = ({ addNotification }) => {
  const [output, setOutput] = useState(["Welcome to the Command Prompt!"]);
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const outputRef = useRef(null);
  const prompt = "C:\\>";

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommandExecution = useCallback(() => {
    const trimmed = command.trim();
    const newOutput = [...output, `${prompt} ${trimmed}`];

    if (trimmed === "help") {
      newOutput.push(
        "Available commands: help, echo, notify, clear, time, list"
      );
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
    } else if (trimmed === "time") {
      newOutput.push(`Current time: ${new Date().toLocaleTimeString()}`);
    } else if (trimmed === "list") {
      newOutput.push("Commands and their descriptions:");
      commandsInfo.forEach(({ command, description }) => {
        newOutput.push(`- ${command}: ${description}`);
      });
    } else if (trimmed) {
      newOutput.push("Unknown command. Type 'help' for a list of commands.");
    }

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setOutput(newOutput);
    setCommand("");
  }, [command, output, addNotification]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommandExecution();
    } else if (e.key === "ArrowUp") {
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setCommand("");
      }
    }
  };

  useEffect(() => {
    const filteredSuggestions = commandHistory.filter(
      (cmd) => cmd.startsWith(command) && command !== ""
    );
    setSuggestions(filteredSuggestions);
  }, [command, commandHistory]);

  return (
    <PromptContainer>
      <CommandListContainer>
        <strong>Available Commands:</strong>
        <ul>
          {commandsInfo.map(({ command, description }) => (
            <li key={command}>
              <strong>{command}</strong>: {description}
            </li>
          ))}
        </ul>
      </CommandListContainer>
      <OutputArea ref={outputRef}>
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
          autoFocus
        />
      </InputArea>
      {suggestions.length > 0 && (
        <SuggestionBox>
          {suggestions.map((suggestion, index) => (
            <div key={index}>{suggestion}</div>
          ))}
        </SuggestionBox>
      )}
    </PromptContainer>
  );
};

export default CommandPrompt;
