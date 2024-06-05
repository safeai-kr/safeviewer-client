import React from "react";
import styled from "styled-components";

interface CloseBtnPosition {
  right: number;
  top: number;
}

interface CloseBtnProps {
  position: CloseBtnPosition;
  onClose: () => void;
}

const CloseBtn = styled.div<{ position: CloseBtnPosition }>`
  cursor: pointer;
  width: 16px;
  height: 16px;
  margin: 6px;
  color: white;
  z-index: 1000;
  position: absolute;
  left: ${({ position }) => position.right}px;
  top: ${({ position }) => position.top - 23}px;
`;
const SelectionCloseBtn: React.FC<CloseBtnProps> = ({ position, onClose }) => {
  return (
    <CloseBtn position={position} onClick={() => onClose()}>
      X
    </CloseBtn>
  );
};

export default SelectionCloseBtn;
