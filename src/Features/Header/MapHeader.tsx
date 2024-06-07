import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faUpload, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { CurrentProject } from "../Map/Data/CurrentProject";
import { IsCompressionModalState } from "../Map/Data/IsCompressionModalState";

const HeaderContainer = styled.div`
  width: 100%;
  height: 28px;
  background-color: #272727;
  display: flex;
  padding: 10px 12px;
  align-items: center;
  justify-content: space-between;
`;

const Contents = styled.div`
  display: flex;
  align-items: center;
`;
const HeaderTxt = styled.div`
  color: #58595b;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 0.2rem;
`;
const Logo = styled(FontAwesomeIcon)`
  color: #58595b;
  float: left;
  max-height: 10px;
  margin-right: 4px;
`;
const RightLogo = styled(FontAwesomeIcon)`
  color: #58595b;
  float: left;
  height: 18px;
  weight: 18px;
`;
const UploadLogo = styled(FontAwesomeIcon)`
  color: white;
  float: left;
  height: 18px;
  weight: 18px;
  cursor: pointer;
`;
const RightIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-right: 12px;
`;

const MapHeader: React.FC = () => {
  const navigate = useNavigate();

  // //로그아웃
  // const logoutHandler = async () => {
  //   try {
  //     console.log(document.cookie);

  //     const response = await axios.delete(
  //       "https://www.samsunglife.site/auth/api/authentication/logout",
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     alert("다시 로그인 해주세요");
  //     console.log(response.data);
  //     navigate("/");
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

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
  return (
    <HeaderContainer>
      <Contents>
        <Logo icon={faShield} />
        <HeaderTxt>SafeViewer</HeaderTxt>
      </Contents>
      <RightIcons>
        {isCompression && (
          <UploadLogo
            icon={faUpload}
            onClick={() => {
              console.log("잉");
              setIsCompressionModal(true);
            }}
          />
        )}
        <RightLogo icon={faUser} />
      </RightIcons>
      {/* <LogoutBtn onClick={logoutHandler} /> */}
    </HeaderContainer>
  );
};

export default MapHeader;
