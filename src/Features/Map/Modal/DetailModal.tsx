import {
  faCalendar,
  faGlobe,
  faSatellite,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import styled from "styled-components";

interface ModalProps {
  setMarkerClicked: Dispatch<SetStateAction<boolean>>;
  modalPosition: { x: number; y: number };
  longitude: number;
  latitude: number;
  projectName1: string;
  projectName2: string;
  locationName: string;
  country: string;
  idNum: number[];
}

interface DataType {
  longitude: number;
  latitude: number;
  projectName: string;
  locationName: string;
}
const ModalContainer = styled.div<{ position: { x: number; y: number } }>`
  width: 528px;
  height: 350px;
  position: fixed;
  left: ${({ position }) => position.x}px;
  top: ${({ position }) => position.y}px;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 12px;
  background: #272727;
  padding: 28px;
  gap: 32px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  color: white;
  position: relative;
  font-size: 16px;
  width: 100%;
  justify-content: space-between;
  box-sizing: border-box;
`;

const LocTxt = styled.div`
  color: #fff;

  leading-trim: both;

  text-edge: cap;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
`;

const CountryTxt = styled.div`
  margin-left: 4px;
  flex-grow: 1;
  color: #8a8a8a;
  leading-trim: both;
  text-edge: cap;
  font-family: Pretendard;
  font-size: 9px;
  font-style: normal;
  font-weight: 600;
`;
const CloseBtn = styled.div`
  position: absolute;
  cursor: pointer;
  right: 10px;
`;
const ModalContents = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  gap: 24px;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  width: 100%;
  margin-top: -2%;
`;
const IntroBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const IndexBox = styled.div`
  padding: 2px 4px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  margin-right: 4px;
  background-color: white;
  color: black;
`;
const ProjectName = styled.div`
  color: white;
  font-size: 14px;
  margin: 10px 0;
  font-weight: 600;
`;
const Img = styled.img`
  width: 224px;
  height: 126px;
  border-radius: 8px;
  background-color: #d9d9d9;
  margin-bottom: 12px;
`;
const Details = styled.div`
  max-height: 40px;
  color: gray;
  font-size: 12px;
  padding: 0px 4px;
`;
const DetailTxt = styled.div`
  max-height: 6px;
  color: #8a8a8a;
  text-edge: cap;
  font-family: Pretendard;
  font-size: 9px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 8px;
`;
const DetailIcon = styled(FontAwesomeIcon)``;

const DetailBtn = styled.button`
  width: 100%;
  background-color: #000;
  color: #fff;
  font-size: 14px;
  border-radius: 999px;
  border: 0.4px solid #fff;
  margin-top: 16px;
  background: #272727;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    color: black;
  }
`;

const DetailModal: React.FC<ModalProps> = ({
  setMarkerClicked,
  modalPosition,
  longitude,
  latitude,
  projectName1,
  projectName2,
  locationName,
  country,
  idNum,
}) => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [data, setData] = useState<DataType | null>(null);

  const handleViewClick = (projectName: string | undefined) => {
    if (projectName && locationName && longitude && latitude) {
      setData({
        locationName,
        longitude,
        latitude,
        projectName,
      });
    }
  };
  useEffect(() => {
    if (data !== null) {
      setMarkerClicked(false);
      navigate("/project", { state: { data } });
    }
  }, [data, navigate, setMarkerClicked]);

  return (
    <ModalContainer position={modalPosition}>
      <ModalHeader>
        <LocTxt>{locationName}</LocTxt>
        <CountryTxt>{country}</CountryTxt>

        <CloseBtn
          onClick={() => {
            setMarkerClicked(false);
          }}
        >
          X
        </CloseBtn>
      </ModalHeader>
      <ModalContents>
        <ContentBox>
          <IntroBox>
            <IndexBox>{idNum[0]}</IndexBox>
            <ProjectName>{projectName1}</ProjectName>
          </IntroBox>

          <Img src={require("./free-icon-ship-254157.png")} alt="ship" />

          <Details>
            <DetailTxt>
              <DetailIcon icon={faGlobe} />
              {longitude}, {latitude}
            </DetailTxt>
            <DetailTxt>
              <DetailIcon icon={faSatellite} />
              Satellite 23.6.18
            </DetailTxt>
            <DetailTxt>
              <DetailIcon icon={faCalendar} />
              24.5.26
            </DetailTxt>
          </Details>
          <DetailBtn onClick={() => handleViewClick(projectName1)}>
            View
          </DetailBtn>
        </ContentBox>
        <ContentBox>
          <IntroBox>
            <IndexBox>{idNum[1]}</IndexBox>
            <ProjectName>{projectName2}</ProjectName>
          </IntroBox>

          <Img src={require("./free-icon-ship-254157.png")} alt="ship" />

          <Details>
            <DetailTxt>
              <DetailIcon icon={faGlobe} />
              {longitude}, {latitude}
            </DetailTxt>
            <DetailTxt>
              <DetailIcon icon={faSatellite} />
              Satellite 23.6.18
            </DetailTxt>
            <DetailTxt>
              <DetailIcon icon={faCalendar} />
              24.5.26
            </DetailTxt>
          </Details>
          <DetailBtn onClick={() => handleViewClick(projectName2)}>
            View
          </DetailBtn>
        </ContentBox>
      </ModalContents>
    </ModalContainer>
  );
};

export default DetailModal;
