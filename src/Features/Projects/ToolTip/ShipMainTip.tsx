import React, { SetStateAction } from "react";
import styled from "styled-components";

interface ShipMainProps {
  setIsShipMainTip: React.Dispatch<SetStateAction<boolean>>;
  setIsShipSideTip: React.Dispatch<SetStateAction<boolean>>;
}

const ShipMainContainer = styled.div`
  max-width: 298px;
  max-height: 93px;
  padding: 20px;
  position: absolute;
  top: 60%;
  left: 55%;
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
    left: -17px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid #000;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
  }
`;

const ShipMainText = styled.div`
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

const ShipMainTip: React.FC<ShipMainProps> = ({
  setIsShipMainTip,
  setIsShipSideTip,
}) => {
  return (
    <ShipMainContainer>
      <ShipMainText>
        Click on the labeled object.
        <br /> You can see the ROI(Region of Interest) data.
      </ShipMainText>

      <GotBtn
        onClick={() => {
          setIsShipMainTip(false);
          setIsShipSideTip(true);
        }}
      >
        Got it
      </GotBtn>
    </ShipMainContainer>
  );
};

export default ShipMainTip;
