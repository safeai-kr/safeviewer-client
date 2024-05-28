import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import RightSideBar from "./SideBar/RightSideBar";
import styled from "styled-components";
import Tab from "../Header/Tab";

interface DataProps {
  locationName: string;
  projectName: string;
  longitude: number;
  latitude: number;
}
const ProjectsContainer = styled.div`
  position: relative;
  height: calc(100vh - 68px);
`;

const ProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location?.state?.data as DataProps;
  console.log(data);
  //전체 탭들 목록
  const [tabs, setTabs] = useState<string[]>([]);
  //현재 선택된 탭
  const [currentTab, setCurrentTab] = useState<number>(1);

  //메인에서 프로젝트 화면 들어갈 때 탭 추가
  // useEffect(() => {
  //   setTabs((prevTabs) => [
  //     ...prevTabs,
  //     {
  //       locationName: data?.locationName,
  //       projectName: data?.projectName,
  //       longitude: data?.longitude,
  //       latitude: data?.latitude,
  //     },
  //   ]);

  //   navigate(`/project/${data?.projectName}`, {
  //     state: {
  //       longitude: data?.longitude,
  //       latitude: data?.latitude,
  //       locationName: data?.locationName,
  //       projectName: data?.projectName,
  //     },
  //   });
  // }, [data, navigate, currentTab]);

  // useEffect(() => {
  //   //새로 생긴 탭 선택
  //   if (tabs.length > 0) {
  //     setCurrentTab(tabs.length);
  //   }
  //   //탭을 모두 지웠을 때 다시 메인화면으로
  //   if (tabs.length === 0 && !data) {
  //     navigate("/");
  //   }
  // }, [data, navigate, tabs]);

  useEffect(() => {
    setTabs([]);
  }, []);

  //프로젝트 화면에서 다른 프로젝트를 더 추가할 때 탭 추가(예정)

  return (
    <>
      <ProjectsContainer>
        <Tab
          // tabs={tabs}
          // setTabs={setTabs}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        {/* project 컴포넌트 */}
        <Outlet />
        <RightSideBar />
      </ProjectsContainer>
    </>
  );
};

export default ProjectPage;
