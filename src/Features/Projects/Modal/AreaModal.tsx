import React from "react";
import styled from "styled-components";

const AreaBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border: 1px dashed #fff;
  background: rgba(0, 0, 0, 0);
  box-shadow: 4px 4px 20px 0px rgba(0, 0, 0, 0.3);
`;
const AreaModal: React.FC = () => {
  return <AreaBox />;
};

export default AreaModal;
