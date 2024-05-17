import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faUser } from "@fortawesome/free-solid-svg-icons";
import LogoutBtn from "./LogoutBtn";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

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
  margin-bottom: 0.2rem;
`;
const Logo = styled(FontAwesomeIcon)`
  color: #58595b;
  float: left;
  height: 18px;
  weight: 18px;
  margin-right: 12px;
`;

const MapHeader: React.FC = () => {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      console.log(document.cookie);

      const response = await axios.delete(
        "https://www.samsunglife.site/auth/api/authentication/logout",
        {
          withCredentials: true,
        }
      );
      alert("다시 로그인 해주세요");
      console.log(response.data);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <HeaderContainer>
      <Contents>
        <Logo icon={faShield} />
        <HeaderTxt>SafeViewer</HeaderTxt>
      </Contents>
      <Logo icon={faUser}></Logo>
      <LogoutBtn onClick={logoutHandler} />
    </HeaderContainer>
  );
};

export default MapHeader;
