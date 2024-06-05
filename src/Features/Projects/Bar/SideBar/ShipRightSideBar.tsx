import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";

const SideBarContainer = styled.div`
  width: 296px;
  height: 100%;
  background-color: #272727;
  position: absolute;
  top: 40px;
  right: 0;
`;

const SideBarHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 12px;
`;
const TitleText = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

const SideBarContents = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
`;
const ContentsHeader = styled.div`
  display: flex;
  padding: 8px 12px;
  flex-direction: row;
  align-items: flex-start;
  gap: 80px;
`;
const TxtBox = styled.div`
  display: flex;
  gap: 6px;
`;
const AllTxt = styled.text`
  color: #d5d5d5;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  width: 17px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const NumTxt = styled.text`
  width: 24px;
  height: 14px;
  color: #6f6f6f;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
`;
const Label = styled.label`
  display: flex;
  align-items: stretch;
  cursor: pointer;
  color: #d5d5d5;

  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
`;
const AreaCheckBox = styled.input.attrs({ type: "checkbox" })`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid #d5d5d5;
  margin-right: 4px;
`;
const ContentsBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const ShipBox = styled.div`
  display: flex;
  width: 80%;
  padding: 12px;
  align-items: center;
`;

const ShipImg = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 4px;
  border: none;
  margin-right: 12px;
`;
const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`;
const ShipName = styled.div`
  color: #d5d5d5;

  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
`;
const ShipSize = styled.div`
  color: #d5d5d5;

  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 300;
`;
const ShipRightSideBar: React.FC = () => {
  const handleCheckboxClick = () => {};
  return (
    <>
      <SideBarContainer>
        <SideBarHeader>
          <TitleText>Ship Detection</TitleText>
        </SideBarHeader>
        <SideBarContents>
          <ContentsHeader>
            <TxtBox>
              <AllTxt>All</AllTxt>
              <NumTxt>124</NumTxt>
            </TxtBox>
            <Label>
              <AreaCheckBox />
              within the current area
            </Label>
          </ContentsHeader>
          {/* ShipBoxe들은 모델 연결 이후 응답에 따라 동적으로 map함수로 렌더링 */}
          <ContentsBody>
            <ShipBox>
              <ShipImg src="screenshot.png" />
              <InfoBox>
                <ShipName>Ship_01</ShipName>
                <ShipSize>18.5 x 200m</ShipSize>
              </InfoBox>
            </ShipBox>
            <ShipBox>
              <ShipImg src="screenshot.png" />
              <InfoBox>
                <ShipName>Ship_01</ShipName>
                <ShipSize>18.5 x 200m</ShipSize>
              </InfoBox>
            </ShipBox>
            <ShipBox>
              <ShipImg src="screenshot.png" />
              <InfoBox>
                <ShipName>Ship_01</ShipName>
                <ShipSize>18.5 x 200m</ShipSize>
              </InfoBox>
            </ShipBox>
          </ContentsBody>
        </SideBarContents>
      </SideBarContainer>
    </>
  );
};

export default ShipRightSideBar;
