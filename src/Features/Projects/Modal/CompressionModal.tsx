import React from "react";
import styled from "styled-components";

interface ModalProps {
  url: string;
  setIsCompressionModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContainer = styled.div`
  background: #272727;
  border-radius: 8px;
  max-width: 75%;
  max-height: 68%;
  position: relative;
  color: white;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-start;
`;
const ModalTitle = styled.div`
  width: 50px;
  height: 22px;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  margin-right: auto;
  margin-top: 26px;
  margin-left: 40px;
`;
const CloseBtn = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-top: 18px;
  margin-right: 23px;
`;

const CompressionModal: React.FC<ModalProps> = ({
  url,
  setIsCompressionModal,
}) => {
  return (
    <ModalBackground onClick={() => setIsCompressionModal(false)}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Export</ModalTitle>
          <CloseBtn onClick={() => setIsCompressionModal(false)}>X</CloseBtn>
        </ModalHeader>
        <img
          src={url}
          alt="Screenshot"
          style={{ width: "100%", height: "auto" }}
        />
        <img
          src={url}
          alt="Screenshot"
          style={{ width: "100%", height: "auto" }}
        />
        <button onClick={() => setIsCompressionModal(false)}>Close</button>
      </ModalContainer>
    </ModalBackground>
  );
};

export default CompressionModal;
