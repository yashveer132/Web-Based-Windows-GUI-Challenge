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
  border: 2px solid var(--window-border);
  padding: 40px 30px;
  width: 400px;
  border-radius: 12px;
  text-align: center;
  color: var(--text-color);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
  margin-bottom: 15px;
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #b0b0b0;
  margin-bottom: 25px;
`;

const Input = styled.input`
  width: 90%;
  padding: 12px;
  margin-bottom: 20px;
  background-color: #2e2e2e;
  border: 2px solid var(--window-border);
  color: var(--text-color);
  border-radius: 8px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #0078d4;
  }
`;

const Button = styled.button`
  background-color: #0078d4;
  border: none;
  color: #ffffff;
  padding: 12px 30px;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #005fa3;
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(0);
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
        <Subtitle>Please enter your password to continue.</Subtitle>
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
