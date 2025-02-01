import React, { useState } from "react";
import styled from "styled-components";

const MenuContainer = styled.div`
  position: fixed;
  background-color: var(--window-bg);
  border: 1px solid var(--window-border);
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  padding: 5px 0;
  z-index: 1000;
  color: var(--text-color);
  min-width: 200px;
  border-radius: 5px;
  overflow: hidden;
  @media (max-width: 600px) {
    min-width: 150px;
    font-size: 0.9rem;
  }
`;

const MenuItem = styled.div`
  padding: 8px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: var(--taskbar-button-active);
  }
  @media (max-width: 600px) {
    padding: 6px 15px;
  }
`;

const SubMenuContainer = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  background-color: var(--window-bg);
  border: 1px solid var(--window-border);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  padding: 5px 0;
  min-width: 180px;
  border-radius: 5px;
  @media (max-width: 600px) {
    min-width: 140px;
  }
`;

const Separator = styled.div`
  height: 1px;
  background-color: var(--window-border);
  margin: 5px 0;
`;

const SubMenuArrow = styled.span`
  margin-left: auto;
  font-size: 12px;
  color: var(--text-color);
`;

const ContextMenu = ({ x, y, items, onClose }) => {
  const [subMenuIndex, setSubMenuIndex] = useState(null);
  return (
    <MenuContainer
      style={{
        left: x + 200 > window.innerWidth ? window.innerWidth - 210 : x,
        top: y + 300 > window.innerHeight ? window.innerHeight - 310 : y,
      }}
    >
      {items.map((item, index) => {
        if (item.type === "separator") {
          return <Separator key={index} />;
        }
        return (
          <div key={index} style={{ position: "relative" }}>
            <MenuItem
              onMouseEnter={() => item.subMenu && setSubMenuIndex(index)}
              onMouseLeave={() => setSubMenuIndex(null)}
              onClick={() => {
                if (!item.subMenu) {
                  item.onClick();
                  onClose();
                }
              }}
            >
              {item.label}
              {item.subMenu && <SubMenuArrow>▶</SubMenuArrow>}
            </MenuItem>
            {item.subMenu && subMenuIndex === index && (
              <SubMenuContainer>
                {item.subMenu.map((subItem, subIndex) => (
                  <MenuItem
                    key={subIndex}
                    onClick={() => {
                      subItem.onClick();
                      onClose();
                    }}
                  >
                    {subItem.label}
                  </MenuItem>
                ))}
              </SubMenuContainer>
            )}
          </div>
        );
      })}
    </MenuContainer>
  );
};

export default ContextMenu;
