import {
  faVectorSquare,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { colors } from "../../../Utils/colors";
import { useLocation } from "react-router-dom";

import { ReactComponent as DragIcon } from "../../../Icons/default/tool1_rectangle.svg";
import { ReactComponent as MagicBarIcon } from "../../../Icons/default/tool2_image effect.svg";

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
  background-color: ${colors.default900};
  position: absolute;
  z-index: 1000;
  gap: 8px;
`;

const ToolButton = styled.div<{ selected: boolean; active: boolean }>`
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  margin: 0;
  padding: 20px;
  color: white;
  cursor: ${(props) => (props.active ? "pointer" : "default")};
  border-radius: 4px;
  ${(props) =>
    props.selected &&
    css`
      background-color: ${colors.default700};
    `}
`;

const ToolIcon = styled.div<{ active: boolean }>`
  color: ${(props) => (props.active ? "white" : colors.default400)};
  font-size: 20px;
`;

const ToolBar: React.FC<ToolProps> = ({ selectedTool, setSelectedTool }) => {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [isMagicBarActive, setIsMagicBarActive] = useState<boolean>(false);

  const location = useLocation();
  useEffect(() => {
    const pathnameArr = location.pathname.split("/");
    const projectName = pathnameArr[2];
    if (projectName === "shipdetection") {
      setIsDragActive(false);
      setIsMagicBarActive(false);
    }
    if (projectName === "customdetection") {
      setIsDragActive(true);
      setIsMagicBarActive(false);
    }
    if (projectName === "superresolution") {
      setIsDragActive(false);
      setIsMagicBarActive(true);
    }
    if (projectName === "compression") {
      setIsDragActive(true);
      setIsMagicBarActive(false);
    }
  }, []);
  return (
    <ToolContainer>
      <ToolButton
        active={isDragActive}
        selected={selectedTool === "drag"}
        onClick={() => {
          setSelectedTool(selectedTool === "drag" ? null : "drag");
        }}
      >
        <ToolIcon active={isDragActive}>
          <DragIcon
            fill={isDragActive ? "white" : colors.default400}
            stroke={isDragActive ? "white" : colors.default400}
          />
        </ToolIcon>
      </ToolButton>
      <ToolButton
        active={isMagicBarActive}
        selected={selectedTool === "magic"}
        onClick={() => {
          setSelectedTool(selectedTool === "magic" ? null : "magic");
        }}
      >
        <ToolIcon active={isMagicBarActive}>
          <MagicBarIcon
            fill={isMagicBarActive ? "white" : colors.default400}
            stroke={isMagicBarActive ? "white" : colors.default400}
          />
        </ToolIcon>
      </ToolButton>
    </ToolContainer>
  );
};

export default ToolBar;
