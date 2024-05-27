import React from "react";
import { Outlet } from "react-router-dom";
import MapHeader from "../Header/MapHeader";

const AuthLayout: React.FC = () => {
  return (
    <>
      {/* 로그인 되었을 때 헤더랑 탭 뜨도록 */}
      <MapHeader />
      <Outlet />
    </>
  );
};

export default AuthLayout;
