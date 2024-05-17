import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faUser } from "@fortawesome/free-solid-svg-icons";
import LogoutBtn from "./LogoutBtn";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { TokenProps } from "../Login/type";
import { Tokens } from "../Recoil/Auth/Tokens";

const HeaderContainer = styled.div`
  width: 100%;
  height: 28px;
  background-color: #272727;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Contents = styled.div`
  display: flex;
  align-items: center;
  padding-left: 16px;
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
  margin-right: 16px;
`;

const MapHeader: React.FC = () => {
  const [cookies, , removeCookie] = useCookies([
    "access_token_cookie",
    "csrf_access_token",
    "csrf_refresh_token",
    "refresh_token_cookie",
  ]);

  const [tokens, setTokens] = useRecoilState<TokenProps>(Tokens);
  const accessToken = cookies.csrf_access_token;
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      console.log(tokens);
      const response = await axios.delete(
        "https://www.samsunglife.site/auth/api/authentication/logout",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
    removeCookie("access_token_cookie", { path: "/" });
    removeCookie("csrf_access_token", { path: "/" });
    removeCookie("csrf_refresh_token", { path: "/" });
    removeCookie("refresh_token_cookie", { path: "/" });
    localStorage.clear();
    sessionStorage.clear();
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
