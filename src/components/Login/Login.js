import React, { useState } from "react";
import styled from "styled-components";
import ProfileSelection from "./ProfileSelection";
import { setStoredUser } from "../../utils/storage";

const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a40, #202055);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GlassBox = styled.div`
  background: rgba(30, 30, 70, 0.8);
  backdrop-filter: blur(15px);
  padding: 50px 40px;
  width: 420px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    width: 90%;
    padding: 30px 20px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
  text-shadow: 0px 3px 5px rgba(0, 0, 0, 0.6);

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #d0d0e1;
  margin-bottom: 25px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  width: 90%;
  padding: 12px;
  margin-bottom: 20px;
  background-color: rgba(46, 46, 70, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: 0.3s;
  box-shadow: inset 0px 3px 5px rgba(0, 0, 0, 0.6);

  &:focus {
    border-color: #0078d4;
    box-shadow: 0px 0px 8px #0078d4;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #0078d4, #005fa3);
  border: none;
  color: #ffffff;
  padding: 12px 30px;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);

  &:hover {
    background: linear-gradient(135deg, #008bf7, #0065c1);
    transform: translateY(-3px);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.6);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 25px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 8px 20px;
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
      <GlassBox>
        <Title>Welcome, {selectedProfile}!</Title>
        <Subtitle>Please enter your password to continue.</Subtitle>
        <Input
          type="password"
          placeholder="Enter a password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Login</Button>
      </GlassBox>
    </LoginContainer>
  );
}
