import React, { SetStateAction } from "react";
import styled from "styled-components";

interface DragProps {
  setIsDragTip: React.Dispatch<SetStateAction<boolean>>;
  setIsExportTip?: React.Dispatch<SetStateAction<boolean>>;
  setIsSideTip?: React.Dispatch<SetStateAction<boolean>>;
}

const DragContainer = styled.div`
  max-width: 234px;
  max-height: 114px;
  padding: 20px;
  position: absolute;
  top: 55px;
  left: 70px;
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

const DragTxtBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const DragTitle = styled.div`
  width: 120px;
  height: 8px;
  color: #fff;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  display: flex;
  align-items: center;
`;

const DragText = styled.div`
  width: 100%;
  color: #fff;
  leading-trim: both;
  text-edge: cap;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  margin-top: 12px;
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

const DragTip: React.FC<DragProps> = ({
  setIsDragTip,
  setIsExportTip,
  setIsSideTip,
}) => {
  return (
    <DragContainer>
      <DragTxtBox>
        <DragTitle>Rectangle Select tool</DragTitle>
        <DragText>
          Drag to select the area
          <br /> where you want to export the image
        </DragText>
      </DragTxtBox>
      <GotBtn
        onClick={() => {
          setIsDragTip(false);
          if (setIsExportTip) setIsExportTip(true);
          if (setIsSideTip) setIsSideTip(true);
        }}
      >
        Got it
      </GotBtn>
    </DragContainer>
  );
};

export default DragTip;
