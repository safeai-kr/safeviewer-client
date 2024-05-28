import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

interface ZoomProps {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

const ZoomContainer = styled.div`
  position: absolute;
  top: 282px;
  background: #272727;
  z-index: 1000;
  display: flex;
  padding: 3px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 44px;
  height: 88px;
  flex-wrap: wrap;
  border: none;
`;

const ZoomButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  margin: 3px 0;
  color: white;
  cursor: pointer;
`;

const ZoomIcon = styled(FontAwesomeIcon)`
  color: white;
  font-size: 20px;
`;
const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: #ccc;
`;
const ZoomBar: React.FC<ZoomProps> = ({ handleZoomIn, handleZoomOut }) => {
  return (
    <ZoomContainer>
      <ZoomButton onClick={handleZoomIn}>
        <ZoomIcon icon={faPlus} />
      </ZoomButton>
      <Separator />
      <ZoomButton onClick={handleZoomOut}>
        <ZoomIcon icon={faMinus} />
      </ZoomButton>
    </ZoomContainer>
  );
};

export default ZoomBar;
