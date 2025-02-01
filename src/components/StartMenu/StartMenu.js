import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPowerOff,
  faSyncAlt,
  faMoon,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MenuContainer = styled.div`
  position: absolute;
  bottom: 50px;
  left: 10px;
  width: 340px;
  background-color: #1e1e2f;
  border-radius: 10px;
  border: 1px solid #333;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  animation: ${slideUp} 0.3s ease-out forwards;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  @media (max-width: 600px) {
    width: 260px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #333;
  gap: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  background-color: #1e1e2f;
  color: white;
  border-radius: 5px;
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border: 1px solid #4a90e2;
  }
`;

const MenuItems = styled.div`
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }
`;

const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #29293d;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-size: 0.85rem;
  text-align: center;
  transition: background-color 0.3s ease;
  height: 90px;
  &:hover {
    background-color: #4a4a5e;
  }
  .emoji {
    font-size: 1.8rem;
    margin-bottom: 5px;
  }
  @media (max-width: 600px) {
    height: 70px;
    padding: 10px;
    font-size: 0.75rem;
    .emoji {
      font-size: 1.5rem;
    }
  }
`;

const RecentAppsSection = styled.div`
  padding: 10px;
  background-color: #333;
  border-top: 1px solid #444;
`;

const RecentApp = styled.div`
  padding: 5px;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  &:hover {
    background-color: #4a4a5e;
  }
`;

const UserSection = styled.div`
  padding: 10px;
  background-color: #29293d;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #444;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
`;

const PowerSection = styled.div`
  padding: 10px;
  background-color: #29293d;
  border-top: 1px solid #444;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoutButton = styled.div`
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1rem;
  &:hover {
    color: #ff4f4f;
  }
`;

const PowerOptions = styled.div`
  display: flex;
  gap: 15px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    gap: 5px;
    &:hover {
      color: #ff4f4f;
    }
  }
  @media (max-width: 600px) {
    gap: 10px;
    font-size: 0.9rem;
  }
`;

const StartMenu = ({ isOpen, onClose, apps, currentUser, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentApps, setRecentApps] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredApps = useMemo(() => {
    return apps.filter((app) =>
      app.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [apps, searchTerm]);

  const handleItemClick = useCallback(
    (app) => {
      app.onClick();
      setRecentApps((prev) =>
        [app, ...prev.filter((a) => a.id !== app.id)].slice(0, 5)
      );
      onClose();
    },
    [onClose]
  );

  const handlePowerOption = (option) => {
    if (option === "logout") onLogout();
    alert(`${option} initiated!`);
  };

  return (
    <MenuContainer ref={menuRef} isOpen={isOpen}>
      <SearchBar>
        <FontAwesomeIcon icon={faSearch} color="white" />
        <SearchInput
          type="text"
          placeholder="Search apps..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchBar>
      <MenuItems>
        {filteredApps.map((app) => (
          <MenuItem key={app.id} onClick={() => handleItemClick(app)}>
            <div className="emoji">{app.emoji}</div>
            <div>{app.title}</div>
          </MenuItem>
        ))}
      </MenuItems>
      <UserSection>
        <div>{currentUser?.name}</div>
        <LogoutButton onClick={onLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
        </LogoutButton>
      </UserSection>
      <PowerSection>
        <PowerOptions>
          <div onClick={() => handlePowerOption("sleep")}>
            <FontAwesomeIcon icon={faMoon} /> Sleep
          </div>
          <div onClick={() => handlePowerOption("restart")}>
            <FontAwesomeIcon icon={faSyncAlt} /> Restart
          </div>
          <div onClick={() => handlePowerOption("shutdown")}>
            <FontAwesomeIcon icon={faPowerOff} /> Shut Down
          </div>
        </PowerOptions>
      </PowerSection>
    </MenuContainer>
  );
};

export default StartMenu;
