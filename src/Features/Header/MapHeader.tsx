import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faUpload, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, useNavigation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { CurrentProject } from "../Map/Data/CurrentProject";
import { IsCompressionModalState } from "../Map/Data/IsCompressionModalState";
import { colors } from "../../Utils/colors";
import { ReactComponent as Shield } from "../../Icons/project3_shild_superresolution.svg";
import { ReactComponent as Export } from "../../Icons/project4_export.svg";
const HeaderContainer = styled.div`
  width: 100%;
  height: 28px;
  background-color: ${colors.default900};
  display: flex;
  flex-direction: row;
  padding: 10px 12px;
  align-items: center;
  justify-content: space-between;
`;

const Contents = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;
const HeaderTxt = styled.div`
  color: #58595b;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;
`;
const UploadLogo = styled.div`
  color: white;
  float: left;
  height: 18px;
  weight: 18px;
  cursor: pointer;
  margin-right: 40px;
`;
const RightIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-right: 12px;
`;

const MapHeader: React.FC = () => {
  const [isCompression, setIsCompression] = useState<boolean>(false);
  const setIsCompressionModal = useSetRecoilState<boolean>(
    IsCompressionModalState
  );
  const currentProject = useRecoilValue<string>(CurrentProject);
  useEffect(() => {
    if (currentProject === "Compression") {
      setIsCompression(true);
    } else {
      setIsCompression(false);
    }
  }, [currentProject]);
  const navigate = useNavigate();
  return (
    <HeaderContainer>
      <Contents>
        <Shield fill={colors.default400} />
        <HeaderTxt onClick={() => navigate("./")}>SafeViewer</HeaderTxt>
      </Contents>
      <RightIcons>
        {isCompression && (
          <UploadLogo
            onClick={() => {
              console.log("잉");
              setIsCompressionModal(true);
            }}
          >
            <Export width={18} height={18} />
          </UploadLogo>
        )}
      </RightIcons>
    </HeaderContainer>
  );
};

export default MapHeader;
