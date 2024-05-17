import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { LoginUser } from "../Recoil/Auth/LoginUser";
import { IdType, LoginValue } from "./type";
import { useCookies } from "react-cookie";
import useLoginUser from "./Hooks/useLoginUser";

const LoginContainer = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  width: 30%;
  margin: auto;
`;
const LoginForm = styled.form``;

const Login: React.FC = () => {
  const [loginId, setLoginId] = useRecoilState<IdType>(LoginUser);
  const [cookies, , removeCookie] = useCookies([
    "access_token_cookie",
    "csrf_access_token",
    "csrf_refresh_token",
    "refresh_token_cookie",
  ]);

  //Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginValue>({ mode: "onChange" });

  const navigate = useNavigate();

  //API호출
  const loginUser = useLoginUser();

  const handleLogin = async (data: LoginValue) => {
    //api 호출
    loginUser.mutate(data);
  };

  // useEffect(() => {
  //   if (!loginId) {
  //     removeCookie("access_token_cookie", { path: "/" });
  //     removeCookie("csrf_access_token", { path: "/" });
  //     removeCookie("csrf_refresh_token", { path: "/" });
  //     removeCookie("refresh_token_cookie", { path: "/" });
  //   }
  // }, []);
  return (
    <>
      <LoginContainer>
        <LoginForm onSubmit={handleSubmit(handleLogin)}>
          <label htmlFor="user_id">아이디</label>
          <input
            type="text"
            id="user_id"
            placeholder="아이디를 입력해주세요."
            {...register("user_id", {
              required: "아이디는 필수 입력 사항입니다.",
            })}
          />
          <br />
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해주세요."
            {...register("password", {
              required: "비밀번호는 필수 입력 사항입니다.",
            })}
          />
          <button type="submit">로그인</button>

          <p className="signup-link">
            아직 회원이 아니신가요? <Link to="./signup">회원가입하기</Link>
          </p>
        </LoginForm>
      </LoginContainer>
    </>
  );
};

export default Login;
