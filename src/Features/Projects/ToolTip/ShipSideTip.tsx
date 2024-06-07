import React, { SetStateAction } from "react";
import styled from "styled-components";

interface ShipSideProps {
  setIsShipSideTip: React.Dispatch<SetStateAction<boolean>>;
  setIsToolIng: React.Dispatch<SetStateAction<boolean>>;
}

const ShipSideContainer = styled.div`
  max-width: 298px;
  max-height: 93px;
  padding: 20px;
  position: absolute;
  top: 90px;
  right: 310px;
  border-radius: 8px;
  background: #000;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  &::after {
    content: "";
    position: absolute;
    top: 9px;
    right: -17px;
    width: 0;
    height: 0;
    border-left: 10px solid #000;
    border-right: 10px solid transparent;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
  }
`;

const ShipSideText = styled.div`
  width: 100%;
  color: #fff;
  leading-trim: both;
  text-edge: cap;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  display: flex;
  justify-content: center;
`;
const GotBtn = styled.div`
  width: 28px;
  height: 8px;
  color: #00ff94;
  text-edge: cap;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Pretendard;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  margin-top: 20px;
  display: flex;
  align-self: flex-end; /* 버튼을 부모 컨테이너의 오른쪽 끝으로 정렬 */
  cursor: pointer;
`;

const ShipSideTip: React.FC<ShipSideProps> = ({
  setIsShipSideTip,
  setIsToolIng,
}) => {
  return (
    <ShipSideContainer>
      <ShipSideText>
        Use the AI search function to search for objects
        <br /> within the area or manage object lists
      </ShipSideText>

      <GotBtn
        onClick={() => {
          setIsShipSideTip(false);
          setIsToolIng(false);
        }}
      >
        Got it
      </GotBtn>
    </ShipSideContainer>
  );
};

export default ShipSideTip;
