import React from "react";
import styled from "styled-components";
import { colors } from "../../../Utils/colors";

interface LocationInfoProps {
  locationName: string;
  country: string;
  position: number[];
}

const LocationContainer = styled.div<{ position: number[] }>`
  display: flex;
  padding: 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  position: absolute;
  border-radius: 8px;
  background: ${colors.default900};
  left: ${({ position }) => `${position[0] - 75}px`};
  top: ${({ position }) => `${position[1] - 60}px`};
  &::after {
    content: "";
    position: absolute;
    bottom: -13px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 7px solid #000;
    border-bottom: 7px solid transparent;
  }
`;
const BigTxt = styled.div`
  color: ${colors.default50};

  text-edge: cap;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
`;
const SmallTxt = styled.div`
  color: ${colors.default300};
  leading-trim: both;

  text-edge: cap;
  font-family: Pretendard;
  font-size: 8px;
  font-style: normal;
  font-weight: 600;
`;
const LocationInfo: React.FC<LocationInfoProps> = ({
  locationName,
  country,
  position,
}) => {
  return (
    <LocationContainer position={position}>
      <BigTxt>{locationName}</BigTxt>
      <SmallTxt>{country}</SmallTxt>
    </LocationContainer>
  );
};

export default LocationInfo;