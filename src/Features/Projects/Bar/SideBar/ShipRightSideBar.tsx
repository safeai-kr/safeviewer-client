import {
  faGlobe,
  faList,
  faRulerHorizontal,
  faRulerVertical,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { SetStateAction, useState } from "react";
import styled, { css } from "styled-components";
import { ShipList } from "../../Data/ShipList";
import { colors } from "../../../../Utils/colors";
import { ReactComponent as GlobeIcon } from "../../../../Icons/project1_coordinate.svg";

import { ReactComponent as LengthIcon } from "../../../../Icons/project1_length.svg";

import { ReactComponent as ListIcon } from "../../../../Icons/project1_list.svg";

interface SelectedShip {
  label: string;
  center: [number, number];
}
interface BarProps {
  setSelectedShip: React.Dispatch<SetStateAction<SelectedShip | null>>;
  selectedShip: SelectedShip | null;
}
interface ShipCategory {
  id: number;
  name: string;
  supercategory: string;
}

const SideBarContainer = styled.div`
  width: 296px;
  height: 100%;
  background-color: #19191b;
  position: absolute;
  top: 40px;
  right: 0;
  overflow-y: hidden;
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
  height: calc(100vh - 116px);
  overflow-y: auto;
  flex-direction: column;
  align-items: flex-start;
`;
const TxtBox = styled.div`
  display: flex;
  gap: 6px;
  padding: 12px;
`;
const AllTxt = styled.text`
  color: ${colors.default50};
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
const ContentsBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const ShipBox = styled.div<{ isSelected: boolean }>`
  display: flex;
  width: 100%;
  padding: 12px;
  cursor: pointer;
  align-items: center;
  ${({ isSelected }) =>
    isSelected &&
    css`
      background: #27292e;
    `}
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
  color: ${colors.default50};

  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
`;
const ShipSize = styled.div`
  color: ${colors.default50};

  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 300;
`;
const Selected = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #19191b;
  height: 100%;
  padding: 12px;
`;
const SelectedHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 8px;
`;
const Name = styled.div`
  color: #eeeef0;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
`;
const BackBtn = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-bottom: 16px;
  width: 18px;
  height: 18px;
`;

const ShipBigImg = styled.img`
  width: 80%;
  height: auto;
  border-radius: 8px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 20px;
`;

const Detail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Logo = styled(FontAwesomeIcon)`
  width: 12px;
  height: 12px;
  background-color: gray;
  border-radius: 50%;
`;
const DetailTxt = styled.div`
  color: #cdced7;
  leading-trim: both;

  text-edge: cap;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
`;
const ShipRightSideBar: React.FC<BarProps> = ({
  selectedShip,
  setSelectedShip,
}) => {
  console.log(selectedShip);
  const shiparr = ShipList.categories;
  const [selectedShipId, setSelectedShipId] = useState<number | null>(null);
  //중앙 좌표 계산 함수
  const calculateCenter = (corners: [number, number][]): [number, number] => {
    const [xSum, ySum] = corners.reduce(
      ([accX, accY], [x, y]) => [accX + x, accY + y],
      [0, 0]
    );
    const centerX = xSum / corners.length;
    const centerY = ySum / corners.length;
    return [centerX, centerY];
  };
  const handleShipClick = (ship: ShipCategory) => {
    const shipData = ShipList.list.find((s) => s.label === ship.name);
    if (shipData) {
      const center = calculateCenter(shipData.corners as [number, number][]);
      setSelectedShip({ label: ship.name, center: center });
      setSelectedShipId(ship.id);
    }
  };
  const formatCoordinates = (coords: [number, number]) => {
    const [lat, lon] = coords;
    const formatCoord = (coord: number) => coord.toFixed(3);
    return `${formatCoord(lat)}, ${formatCoord(lon)}`;
  };
  return (
    <>
      <SideBarContainer>
        {selectedShip === null && (
          <>
            <SideBarHeader>
              <TitleText>Ship Detection</TitleText>
            </SideBarHeader>
            <TxtBox>
              <AllTxt>All</AllTxt>
              <NumTxt>28</NumTxt>
            </TxtBox>
            <SideBarContents>
              {/* ShipBoxe들은 모델 연결 이후 응답에 따라 동적으로 map함수로 렌더링 */}
              <ContentsBody>
                {shiparr.map((ship) => (
                  <ShipBox
                    key={ship.id}
                    onClick={() => handleShipClick(ship)}
                    isSelected={ship.id === selectedShipId}
                  >
                    <ShipImg
                      src={require(`../../Data/ShipImages/${ship.name}.png`)}
                    />
                    <InfoBox>
                      <ShipName>{ship.name}</ShipName>
                      <ShipSize>18.5 x 200m</ShipSize>
                    </InfoBox>
                  </ShipBox>
                ))}
              </ContentsBody>
            </SideBarContents>
          </>
        )}
        {selectedShip !== null && (
          <>
            <Selected>
              <SelectedHeader>
                <BackBtn onClick={() => setSelectedShip(null)}>{"<"}</BackBtn>
                <Name>{selectedShip.label}</Name>
              </SelectedHeader>
              <ShipBigImg
                src={require(`../../Data/ShipImages/${selectedShip.label}.png`)}
              />
              <Details>
                <Detail>
                  <GlobeIcon width={12} height={12} />
                  <DetailTxt>
                    {formatCoordinates(selectedShip.center)}
                  </DetailTxt>
                </Detail>
                <Detail>
                  <LengthIcon width={12} height={12} />
                  <DetailTxt>18.5 x 117.2m</DetailTxt>
                </Detail>
                <Detail>
                  <ListIcon width={12} height={12} />
                  <DetailTxt>Container Ship</DetailTxt>
                </Detail>
              </Details>
            </Selected>
          </>
        )}
      </SideBarContainer>
    </>
  );
};

export default ShipRightSideBar;
