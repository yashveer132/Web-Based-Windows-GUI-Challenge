import React, { useState } from "react";
import styled from "styled-components";
import ProfileSelection from "./ProfileSelection";
import { setStoredUser } from "../../utils/storage";

const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: var(--desktop-bg);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginBox = styled.div`
  background-color: var(--window-bg);
  border: 1px solid var(--window-border);
  padding: 30px;
  width: 300px;
  text-align: center;
  color: var(--text-color);
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 90%;
  padding: 8px;
  margin-bottom: 10px;
  background-color: #1e1e1e;
  border: 1px solid var(--window-border);
  color: var(--text-color);
`;

const Button = styled.button`
  background-color: var(--button-bg);
  border: 1px solid var(--button-border);
  color: var(--text-color);
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background-color: #4a4a4a;
  }

  &:active {
    opacity: 0.8;
  }
`;

export default function Login({ onLogin }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [password, setPassword] = useState("");

  const handleSelectProfile = (profileName) => {
    setSelectedProfile(profileName);
  };

  const handleLogin = () => {
    if (selectedProfile) {
      const userObj = { name: selectedProfile.trim() };
      setStoredUser(userObj);
      onLogin(userObj);
    }
  };

  if (!selectedProfile) {
    return (
      <LoginContainer>
        <ProfileSelection onSelectProfile={handleSelectProfile} />
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Welcome, {selectedProfile}!</Title>
        <Input
          type="password"
          placeholder="Enter a password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Login</Button>
      </LoginBox>
    </LoginContainer>
  );
}
