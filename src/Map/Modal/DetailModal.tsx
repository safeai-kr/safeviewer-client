import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
interface ModalProps {
  setMarkerClicked: Dispatch<SetStateAction<boolean>>;
  modalPosition: { x: number; y: number };
  setImgLayerOn: Dispatch<SetStateAction<boolean>>;
}
const ModalContainer = styled.div<{ position: { x: number; y: number } }>`
  width: 30%;
  height: 30%;
  position: fixed;
  left: ${({ position }) => position.x}px;
  top: ${({ position }) => position.y}px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  color: white;
  font-size: 16px;
  padding: 5px 0px 5px 0px;
  width: 100%;
`;
const CloseBtn = styled.div`
  margin-left: 7.5em;
  margin-right: -8.5rem;
  cursor: pointer;
`;
const ModalContents = styled.div`
  display: flex;
  flex-direction: row; // 방향을 행으로 변경
  align-items: center; // 내용을 센터에 맞춤
  padding: 8px;
  margin-left: 0.7rem;
`;

const DetailBtn = styled.button`
  align-self: center;
  cursor: pointer;
  border: none;
  background: none;
  color: white;
  font-size: 16px;
  width: 100%;
  background-color: black;
  padding: 3px 0px 3px 0px;
`;
const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 3rem;
`;
const Img = styled.img`
  width: 40%;
  object-fit: cover;
  margin-left: 1rem;
  margin-right: 0.7rem;
`;
const DetailModal: React.FC<ModalProps> = ({
  setMarkerClicked,
  modalPosition,
  setImgLayerOn,
}) => {
  return (
    <ModalContainer position={modalPosition}>
      <ModalHeader>
        Ship Detection(Incheon)
        <CloseBtn
          onClick={() => {
            setMarkerClicked(false);
          }}
        >
          X
        </CloseBtn>
      </ModalHeader>
      <ModalContents>
        <Img src={require("./free-icon-ship-254157.png")} alt="ship" />
        <TextArea>
          <p>Monitoring Period</p>
          <p style={{ fontSize: "10px" }}>2023~2024</p>
          <p>ROI Name</p>
          <p style={{ fontSize: "10px" }}>Incheon,Korea</p>
        </TextArea>
      </ModalContents>
      <DetailBtn
        onClick={() => {
          setImgLayerOn(true);
          setMarkerClicked(false);
        }}
      >
        View Details
      </DetailBtn>
    </ModalContainer>
  );
};

export default DetailModal;
