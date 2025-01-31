import React, { useState } from "react";
import styled from "styled-components";
import { getAllProfiles, addProfile } from "../../utils/storage";

const ProfileListContainer = styled.div`
  background-color: var(--window-bg);
  border: 1px solid var(--window-border);
  width: 300px;
  padding: 20px;
  color: var(--text-color);
`;

const Title = styled.h2`
  margin-bottom: 15px;
`;

const ProfileItem = styled.div`
  padding: 8px;
  margin-bottom: 5px;
  background-color: var(--button-bg);
  cursor: pointer;

  &:hover {
    background-color: var(--taskbar-button-active);
  }
`;

const NewProfileInput = styled.input`
  width: 100%;
  margin-top: 10px;
  padding: 6px;
  border: 1px solid var(--window-border);
  background-color: #1e1e1e;
  color: var(--text-color);
`;

const AddButton = styled.button`
  margin-top: 5px;
  padding: 6px 10px;
  background-color: var(--button-bg);
  color: var(--text-color);
  border: 1px solid var(--button-border);
  cursor: pointer;

  &:hover {
    background-color: var(--taskbar-button-active);
  }
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
        </ProfileItem>
      ))}
      <NewProfileInput
        placeholder="New profile name..."
        value={newProfile}
        onChange={(e) => setNewProfile(e.target.value)}
      />
      <AddButton onClick={handleAddProfile}>Add Profile</AddButton>
    </ProfileListContainer>
  );
};

export default ProfileSelection;
