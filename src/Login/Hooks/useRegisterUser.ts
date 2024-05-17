import React from "react";
import { useMutation, useQuery } from "react-query";
import { FormValue } from "../type";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useRegisterUser = () => {
  const navigate = useNavigate();
  return useMutation(
    (data: FormValue) =>
      axios.post<FormValue>(
        "https://www.samsunglife.site/auth/api/authentication/signup",
        data
      ),
    {
      onSuccess: (res) => {
        console.log(res);
        //로그인 페이지
        navigate("/");
      },
      onError: (e) => console.log(e),
    }
  );
};

export default useRegisterUser;
