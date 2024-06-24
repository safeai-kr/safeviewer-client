import { faShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { ImgComparisonSlider } from "@img-comparison-slider/react";
import useSuperResolutionApi from "../API/useSuperResolutionApi";
import axios from "axios";

interface ImgProps {
  imageSrc1: string;
  imageSrc2: string;
  setIsModalClicked: React.Dispatch<SetStateAction<boolean>>;
  setOutputImageUrl: React.Dispatch<SetStateAction<string | null>>;
  outputUrl: string | null;
}

const ModalContainer = styled.div`
  position: fixed;
  top: 28px;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalHeader = styled.div`
  width: 100%;
  height: calc(100vh / 18);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #13ed0e;
  border: none;
`;

const Logo = styled(FontAwesomeIcon)`
  width: 0.9375vw; // 12px at 1280px width
  height: 0.9375vw;
  color: #272727;
  margin-right: 4px;
`;

const HeaderTxt = styled.div`
  color: #272727;
  text-align: center;
  font-family: Pretendard;
  font-size: 1.25vw;
  font-weight: 600;
  padding-bottom: 0.15625vw;
`;

const CloseBtn = styled.div`
  position: absolute;
  right: 20px; // 헤더의 오른쪽 끝에 위치
  color: black;
  cursor: pointer;
`;
const SliderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin-top: 3px;
`;

const StyledImgComparisonSlider = styled(ImgComparisonSlider)`
  width: 100%;
  height: 100%;
  --divider-width: 2px;
  --divider-color: #fff;
  img {
    width: 100%;
    height: auto; // 비율을 유지하며 화면에 맞추도록 수정
    object-fit: contain; // 이미지 비율 유지하면서 컨테이너에 맞추기
  }
`;
const ResolutionModal: React.FC<ImgProps> = ({
  imageSrc1,
  imageSrc2,
  outputUrl,
  setIsModalClicked,
  setOutputImageUrl,
}) => {
  return (
    <ModalContainer>
      <ModalHeader>
        <Logo icon={faShield} />
        <HeaderTxt>Super resolution</HeaderTxt>
        <CloseBtn
          onClick={() => {
            setIsModalClicked(false);
            setOutputImageUrl("");
          }}
        >
          X
        </CloseBtn>
      </ModalHeader>
      <SliderContainer>
        <StyledImgComparisonSlider>
          <img slot="first" src={imageSrc1} alt="Before" />
          <img slot="second" src={imageSrc2} alt="After" />
        </StyledImgComparisonSlider>
      </SliderContainer>
    </ModalContainer>
  );
};

export default ResolutionModal;
