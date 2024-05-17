import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { FormValue } from "./type";
import useRegisterUser from "./Hooks/useRegisterUser";

const RegisterContainer = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  width: 30%;
  margin: auto;
`;
const RegisterForm = styled.form``;

const SignUp: React.FC = () => {
  //Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormValue>({ mode: "onChange" });

  const registerUser = useRegisterUser();
  const handleRegister = async (data: FormValue) => {
    //api 호출
    console.log(data);

    registerUser.mutate(data);
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit(handleRegister)}>
        <label htmlFor="user_id">아이디: </label>
        <input
          type="text"
          id="user_id"
          placeholder="아이디를 입력해주세요."
          {...register("user_id", {
            required: "아이디는 필수 입력 사항입니다.",
          })}
        />
        <br />
        <label htmlFor="password">비밀번호: </label>
        <input
          type="password"
          id="password"
          placeholder="비밀번호를 입력해주세요."
          {...register("password", {
            required: "비밀번호는 필수 입력 사항입니다.",
          })}
        />
        <br />

        {/* 이메일 유효성 검증 */}
        <label htmlFor="email">이메일: </label>
        <input
          type="text"
          id="email"
          placeholder="이메일을 입력해주세요."
          {...register("email", {
            required: "이메일은 필수 입력입니다.",
            pattern: {
              value:
                /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
              message: "이메일 형식에 맞지 않습니다.",
            },
          })}
        />
        <br />
        <label htmlFor="name">이름: </label>
        <input
          type="text"
          id="name"
          placeholder="이름을 입력해주세요."
          {...register("name", {
            required: "이름은 필수 입력 사항입니다.",
          })}
        />
        <br />
        <label htmlFor="gender">성별: </label>
        <select
          id="gender"
          {...register("gender", { required: "성별 선택은 필수입니다." })}
        >
          <option value="">성별을 선택하세요</option>
          <option value="Male">남성</option>
          <option value="Female">여성</option>
        </select>
        <button type="submit">가입</button>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default SignUp;
