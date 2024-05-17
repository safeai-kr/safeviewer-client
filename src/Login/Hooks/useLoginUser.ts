import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { FormValue, IdType, LoginValue, TokenProps } from "../type";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { LoginUser } from "../../Recoil/Auth/LoginUser";

const useLoginUser = () => {
  const [loginId, setLoginId] = useRecoilState<IdType>(LoginUser);

  const navigate = useNavigate();
  return useMutation(
    (data: LoginValue) =>
      axios.post<LoginValue>(
        "https://www.samsunglife.site/auth/api/authentication/signin",
        data,
        {
          withCredentials: true,
        }
      ),
    {
      //로그인 성공
      onSuccess: (res) => {
        console.log(res.data);
        console.log(res);

        alert("로그인 성공");
        setLoginId(res.data.user_id);
        //메인 페이지
        navigate("/auth/main");
      },
      onError: (e) => console.log(e),
    }
  );
};

export default useLoginUser;
