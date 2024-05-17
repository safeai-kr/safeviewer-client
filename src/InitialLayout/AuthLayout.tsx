import React from "react";
import { Outlet } from "react-router-dom";
import MapHeader from "../Header/MapHeader";
import { Tab } from "../Header/Tab";

const AuthLayout: React.FC = () => {
  return (
    <>
      {/* 로그인 되었을 때 헤더랑 탭 뜨도록 */}
      <MapHeader />
      <Tab />
      <Outlet />
    </>
  );
};

export default AuthLayout;
