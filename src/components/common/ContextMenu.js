import React, { useState } from "react";
import styled from "styled-components";

const MenuContainer = styled.div`
  position: fixed;
  background-color: #2c2c2c;
  border: 1px solid #444;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  padding: 5px 0;
  z-index: 1000;
  color: #ffffff;
  min-width: 220px;
  border-radius: 5px;
  overflow: hidden;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1rem;
  @media (max-width: 1024px) {
    min-width: 180px;
  }
  @media (max-width: 600px) {
    min-width: 150px;
  }
`;

const MenuItem = styled.div`
  padding: 12px 15px;
  cursor: pointer;
  text-align: center;
  font-weight: bold;
  &:hover {
    background-color: #3d3d3d;
  }
  @media (max-width: 1024px) {
    padding: 10px 12px;
  }
  @media (max-width: 600px) {
    padding: 8px 10px;
  }
`;

const SubMenuContainer = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  background-color: #2c2c2c;
  border: 1px solid #444;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  padding: 5px 0;
  min-width: 200px;
  border-radius: 5px;
  font-size: 0.9rem;
  @media (max-width: 1024px) {
    min-width: 160px;
  }
  @media (max-width: 600px) {
    min-width: 140px;
  }
`;

const Separator = styled.div`
  height: 1px;
  background-color: #555;
  margin: 5px 0;
`;

const SubMenuArrow = styled.span`
  margin-left: auto;
  font-size: 12px;
  color: #ccc;
`;

const ContextMenu = ({ x, y, items, onClose }) => {
  const [subMenuIndex, setSubMenuIndex] = useState(null);

  return (
    <MenuContainer
      style={{
        left: x + 220 > window.innerWidth ? window.innerWidth - 230 : x,
        top: y + 300 > window.innerHeight ? window.innerHeight - 310 : y,
      }}
      onClick={(e) => e.stopPropagation()}
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
                  item.onClick && item.onClick();
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
                      subItem.onClick && subItem.onClick();
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
