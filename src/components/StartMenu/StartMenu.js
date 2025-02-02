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
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MenuContainer = styled.div`
  position: fixed;
  bottom: clamp(4rem, 8vh, 5rem);
  left: 1vw;
  width: min(90vw, 400px);
  background-color: #1e1e2f;
  border-radius: clamp(0.5rem, 1.5vmin, 1rem);
  border: 1px solid #333;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  animation: ${slideUp} 0.3s ease-out forwards;
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  max-height: 80vh;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  padding: clamp(0.5rem, 1.5vmin, 1rem);
  background-color: #333;
  gap: clamp(0.5rem, 1.5vmin, 1rem);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: clamp(0.4rem, 1.5vmin, 0.8rem);
  border: none;
  background-color: #1e1e2f;
  color: white;
  border-radius: 0.4rem;
  font-size: clamp(0.9rem, 1.8vmin, 1.1rem);

  &:focus {
    outline: 2px solid #4a90e2;
  }
`;

const MenuItems = styled.div`
  padding: clamp(0.5rem, 1.5vmin, 1rem);
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(clamp(5rem, 15vmin, 7rem), 1fr)
  );
  gap: clamp(0.5rem, 1.5vmin, 1rem);
  overflow-y: auto;
`;

const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #29293d;
  padding: clamp(0.5rem, 1.5vmin, 1rem);
  border-radius: 0.5rem;
  cursor: pointer;
  color: white;
  font-size: clamp(0.8rem, 1.8vmin, 1rem);
  aspect-ratio: 1;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4a4a5e;
  }

  .emoji {
    font-size: clamp(1.5rem, 4vmin, 2rem);
    margin-bottom: 0.5vh;
  }
`;

const UserSection = styled.div`
  padding: clamp(0.5rem, 1.5vmin, 1rem);
  background-color: #29293d;
  color: white;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: clamp(0.9rem, 1.8vmin, 1.1rem);

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
`;

const PowerSection = styled.div`
  padding: clamp(0.5rem, 1.5vmin, 1rem);
  background-color: #29293d;
  display: flex;
  justify-content: center;
`;

const LogoutButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #ff4f4f;
  }
`;

const PowerOptions = styled.div`
  display: flex;
  gap: clamp(1rem, 3vw, 2rem);
  font-size: clamp(0.9rem, 1.8vmin, 1.1rem);

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s ease;

    &:hover {
      color: #ff4f4f;
    }
  }
`;

const StartMenu = ({ isOpen, onClose, apps, currentUser, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => e.key === "Escape" && onClose();

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredApps = useMemo(
    () =>
      apps.filter((app) =>
        app.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [apps, searchTerm]
  );

  const handleItemClick = useCallback(
    (app) => {
      app.onClick();
      onClose();
    },
    [onClose]
  );

  return (
    <MenuContainer ref={menuRef} $isOpen={isOpen}>
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
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Log Out</span>
        </LogoutButton>
      </UserSection>
      <PowerSection>
        <PowerOptions>
          <div onClick={() => alert("Sleep initiated!")}>
            <FontAwesomeIcon icon={faMoon} />
            <span>Sleep</span>
          </div>
          <div onClick={() => alert("Restart initiated!")}>
            <FontAwesomeIcon icon={faSyncAlt} />
            <span>Restart</span>
          </div>
          <div onClick={() => alert("Shutdown initiated!")}>
            <FontAwesomeIcon icon={faPowerOff} />
            <span>Shut Down</span>
          </div>
        </PowerOptions>
      </PowerSection>
    </MenuContainer>
  );
};

export default StartMenu;
