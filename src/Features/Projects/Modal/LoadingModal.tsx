import { faShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction } from "react";
import { Oval } from "react-loader-spinner";
import styled from "styled-components";
import { colors } from "../../../Utils/colors";

const ModalContainer = styled.div`
  width: 225px;
  height: 225px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 44px;
  border-radius: 14px;
  background: ${colors.default900};
  padding: 68px 40px;
  z-index: 2000;
`;

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const ModalTxt = styled.div`
  color: #bebebe;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  white-space: nowrap;
`;
const LoaderWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
`;
const LoadingModal: React.FC = () => {
  return (
    <ModalContainer>
      <ModalBox>
        <LoaderWrapper>
          <Oval
            height={100}
            width={100}
            color="white"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="white"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </LoaderWrapper>
        <ModalTxt>Loading...</ModalTxt>
      </ModalBox>
    </ModalContainer>
  );
};

export default LoadingModal;
