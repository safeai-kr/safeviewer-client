import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { FormValue, IdType, LoginValue, TokenProps } from "../type";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import { Tokens } from "../../Recoil/Auth/Tokens";
import { LoginUser } from "../../Recoil/Auth/LoginUser";

const useLoginUser = () => {
  const [loginId, setLoginId] = useRecoilState<IdType>(LoginUser);
  const [tokens, setTokens] = useRecoilState<TokenProps>(Tokens);
  const [cookies, , removeCookie] = useCookies([
    "access_token_cookie",
    "csrf_access_token",
    "csrf_refresh_token",
    "refresh_token_cookie",
  ]);
  const navigate = useNavigate();
  return useMutation(
    (data: LoginValue) =>
      axios.post<LoginValue>(
        "https://www.samsunglife.site/auth/api/authentication/signin",
        data
      ),
    {
      //로그인 성공
      onSuccess: (res) => {
        console.log(res.headers);

        alert("로그인 성공");
        setLoginId(res.data.user_id);
        const access_token_cookie = cookies.access_token_cookie;
        const csrf_access_token = cookies.csrf_access_token;
        const csrf_refresh_token = cookies.csrf_refresh_token;
        const refresh_token_cookie = cookies.refresh_token_cookie;
        setTokens({
          access_token_cookie,
          csrf_access_token,
          csrf_refresh_token,
          refresh_token_cookie,
        });
        //메인 페이지
        navigate("/auth/main");
      },
      onError: (e) => console.log(e),
    }
  );
};

export default useLoginUser;
