import React, { useState } from "react";
import styled from "styled-components";
import { getAllProfiles, addProfile } from "../../utils/storage";

const GlassBox = styled.div`
  background: rgba(20, 20, 60, 0.9);
  backdrop-filter: blur(12px);
  padding: 40px 30px;
  width: 420px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 600px) {
    width: 90%;
    padding: 30px 20px;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
  text-shadow: 0px 3px 5px rgba(0, 0, 0, 0.6);
  margin-bottom: 20px;
`;

const ProfileItem = styled.div`
  padding: 14px 18px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #3e3e80, #5a5ad1);
  color: #ffffff;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  &:hover {
    background: linear-gradient(135deg, #5a5af7, #6b6bff);
    transform: translateY(-4px);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.6);
  }
`;

const Icon = styled.span`
  font-size: 1.6rem;
  color: #e3e3e3;
`;

const NewProfileSection = styled.div`
  margin-top: 25px;
`;

const NewProfileInput = styled.input`
  width: 100%;
  padding: 10px;
  background-color: rgba(46, 46, 70, 0.9);
  color: #ffffff;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  outline: none;
  transition: 0.3s;
  &:focus {
    border-color: #0078d4;
    box-shadow: 0px 0px 8px #0078d4;
  }
`;

const AddButton = styled.button`
  margin-top: 15px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #0078d4, #005fa3);
  color: #ffffff;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.5);
  width: 100%;
  &:hover {
    background: linear-gradient(135deg, #008bf7, #0065c1);
    transform: translateY(-3px);
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
    <GlassBox>
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
        <AddButton onClick={handleAddProfile}>Add Profile</AddButton>
      </NewProfileSection>
    </GlassBox>
  );
};

export default ProfileSelection;
