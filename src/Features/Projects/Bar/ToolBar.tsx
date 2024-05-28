import {
  faVectorSquare,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled, { css } from "styled-components";

interface ToolProps {
  selectedTool: string | null;
  setSelectedTool: React.Dispatch<React.SetStateAction<string | null>>;
}

const ToolContainer = styled.div`
  width: 56px;
  height: 116px;
  padding: 8px;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #272727;
  position: absolute;
  top: 0;
  z-index: 1000;
  gap: 8px;
`;

const ToolButton = styled.div<{ selected: boolean }>`
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  margin: 0;
  padding: 20px;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  ${(props) =>
    props.selected &&
    css`
      background-color: #3e3e3e;
    `}
`;

const ToolIcon = styled(FontAwesomeIcon)`
  color: white;
  font-size: 20px;
`;

const ToolBar: React.FC<ToolProps> = ({ selectedTool, setSelectedTool }) => {
  return (
    <ToolContainer>
      <ToolButton
        selected={selectedTool === "drag"}
        onClick={() => {
          setSelectedTool(selectedTool === "drag" ? null : "drag");
        }}
      >
        <ToolIcon icon={faVectorSquare} />
      </ToolButton>
      <ToolButton
        selected={selectedTool === "magic"}
        onClick={() => {
          setSelectedTool(selectedTool === "magic" ? null : "magic");
        }}
      >
        <ToolIcon icon={faWandMagicSparkles} />
      </ToolButton>
    </ToolContainer>
  );
};

export default ToolBar;
