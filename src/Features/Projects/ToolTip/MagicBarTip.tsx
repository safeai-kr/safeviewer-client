import React, { SetStateAction } from "react";
import styled from "styled-components";

interface MagicProps {
  setIsMagicTip: React.Dispatch<SetStateAction<boolean>>;
}

const MagicContainer = styled.div`
  max-width: 234px;
  max-height: 114px;
  padding: 20px;
  position: absolute;
  top: 110px;
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

const MagicTxtBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const MagicTitle = styled.div`
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

const MagicText = styled.div`
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

const MagicBarTip: React.FC<MagicProps> = ({ setIsMagicTip }) => {
  return (
    <MagicContainer>
      <MagicTxtBox>
        <MagicTitle>Image Effect tool</MagicTitle>
        <MagicText>
          If you want to make your image clear,
          <br /> use the Image Effects tool
        </MagicText>
      </MagicTxtBox>
      <GotBtn
        onClick={() => {
          setIsMagicTip(false);
        }}
      >
        Got it
      </GotBtn>
    </MagicContainer>
  );
};

export default MagicBarTip;
