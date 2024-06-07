import { faShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

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
  background: #272727;
  padding: 68px 40px;
`;

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const ModalIcon = styled(FontAwesomeIcon)`
  width: 52px;
  height: 56px;
  color: #bebebe;
`;
const ModalTxt = styled.div`
  color: #bebebe;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  white-space: nowrap;
`;
const SavedModal: React.FC = () => {
  return (
    <ModalContainer>
      <ModalBox>
        <ModalIcon icon={faShield} />
        <ModalTxt>Image has been saved</ModalTxt>
      </ModalBox>
    </ModalContainer>
  );
};

export default SavedModal;
