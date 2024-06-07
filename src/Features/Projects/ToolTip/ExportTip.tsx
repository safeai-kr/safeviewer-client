import React, { SetStateAction } from "react";
import styled from "styled-components";

interface ExportProps {
  setIsExportTip: React.Dispatch<SetStateAction<boolean>>;
  setIsToolIng: React.Dispatch<SetStateAction<boolean>>;
}

const ExportContainer = styled.div`
  max-width: 260px;
  max-height: 114px;
  padding: 20px;
  position: absolute;
  top: 12px;
  right: 35px;
  border-radius: 8px;
  background: #000;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  &::after {
    content: "";
    position: absolute;
    top: -20px;
    right: 23px;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 10px solid transparent;
    border-bottom: 10px solid #000;
  }
`;

const ExportTxtBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const ExportTitle = styled.div`
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

const ExportText = styled.div`
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

const ExportTip: React.FC<ExportProps> = ({ setIsExportTip, setIsToolIng }) => {
  return (
    <ExportContainer>
      <ExportTxtBox>
        <ExportTitle>Export Icon</ExportTitle>
        <ExportText>
          Image quality remains the same
          <br /> and the capacity can be compressed low
        </ExportText>
      </ExportTxtBox>
      <GotBtn
        onClick={() => {
          setIsExportTip(false);
          setIsToolIng(false);
        }}
      >
        Got it
      </GotBtn>
    </ExportContainer>
  );
};

export default ExportTip;
