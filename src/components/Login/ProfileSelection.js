import React, { useState } from "react";
import styled from "styled-components";
import { getAllProfiles, addProfile } from "../../utils/storage";

const ProfileListContainer = styled.div`
  background-color: var(--window-bg);
  border: 2px solid var(--window-border);
  width: 400px;
  padding: 30px;
  color: var(--text-color);
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
`;

const ProfileItem = styled.div`
  padding: 12px 15px;
  margin-bottom: 10px;
  background-color: var(--button-bg);
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--taskbar-button-active);
    transform: translateY(-2px);
  }
`;

const Icon = styled.span`
  color: #cccccc;
  font-size: 1.3rem;
`;

const NewProfileSection = styled.div`
  margin-top: 20px;
`;

const NewProfileInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid var(--window-border);
  background-color: #2e2e2e;
  color: var(--text-color);
  border-radius: 8px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #0078d4;
  }
`;

const AddButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #0078d4;
  color: #ffffff;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  align-items: center

  &:hover {
    background-color: #005fa3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ProfileSelection = ({ onSelectProfile }) => {
  const [profiles, setProfiles] = useState(getAllProfiles());
  const [newProfile, setNewProfile] = useState("");

  const handleSelect = (profileName) => {
    onSelectProfile(profileName);
  };

  const handleAddProfile = () => {
    if (newProfile.trim()) {
      addProfile(newProfile.trim());
      setProfiles(getAllProfiles());
      setNewProfile("");
    }
  };

  return (
    <ProfileListContainer>
      <Title>Select a Profile</Title>
      {profiles.length === 0 && <div>No profiles found.</div>}
      {profiles.map((prof) => (
        <ProfileItem key={prof} onClick={() => handleSelect(prof)}>
          {prof}
          <Icon>👤</Icon>
        </ProfileItem>
      ))}

      <NewProfileSection>
        <NewProfileInput
          placeholder="New profile name..."
          value={newProfile}
          onChange={(e) => setNewProfile(e.target.value)}
        />
        <ButtonContainer>
          {" "}
          <AddButton onClick={handleAddProfile}>Add Profile</AddButton>{" "}
        </ButtonContainer>
      </NewProfileSection>
    </ProfileListContainer>
  );
};

export default ProfileSelection;
