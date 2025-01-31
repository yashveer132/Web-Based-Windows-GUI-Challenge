import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const MenuContainer = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 300px;
  background-color: var(--window-bg);
  border: 1px solid var(--window-border);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  flex-direction: column;
  z-index: 1000;

  @media (max-width: 600px) {
    width: 220px;
    bottom: 32px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  background-color: var(--taskbar-bg);
`;

const SearchInput = styled.input`
  flex: 1;
  margin-left: 10px;
  padding: 5px;
  border: 1px solid var(--window-border);
  background-color: #1e1e1e;
  color: var(--text-color);

  @media (max-width: 600px) {
    padding: 3px;
  }
`;

const MenuItems = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const MenuItem = styled.div`
  padding: 10px;
  cursor: pointer;
  color: var(--text-color);

  &:hover {
    background-color: var(--taskbar-button-active);
  }
`;

const UserSection = styled.div`
  padding: 10px;
  border-top: 1px solid var(--window-border);
  color: var(--text-color);
  display: flex;
  justify-content: space-between;
`;

const StartMenu = ({ isOpen, onClose, apps, currentUser, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
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
      onClose();
    },
    [onClose]
  );

  return (
    <MenuContainer ref={menuRef} isOpen={isOpen}>
      <SearchBar>
        <FontAwesomeIcon icon={faSearch} color="#fff" />
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
            {app.title}
          </MenuItem>
        ))}
      </MenuItems>

      <UserSection>
        <div>{currentUser?.name}</div>
        <div style={{ cursor: "pointer" }} onClick={onLogout}>
          Log out
        </div>
      </UserSection>
    </MenuContainer>
  );
};

export default StartMenu;
