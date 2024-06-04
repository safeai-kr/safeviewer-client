import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import RightSideBar from "../Features/Projects/Bar/SideBar/RightSideBar";
import styled from "styled-components";
import Tab from "../Features/Header/Tab";
import { CurrentProject } from "../Features/Map/Data/CurrentProject";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

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
  const [isNotRightSideBar, setIsNotRightSideBar] = useState<boolean>(false);
  const currentProject = useRecoilValue<string>(CurrentProject);
  const setCurrentProject = useSetRecoilState<string>(CurrentProject);
  //프로젝트가 Compression 혹은 Super resolution이면 우측 사이드바 제거
  useEffect(() => {
    if (
      currentProject === "Compression" ||
      currentProject === "Super resolution"
    ) {
      setIsNotRightSideBar(true);
    } else {
      setIsNotRightSideBar(false);
    }
  }, [currentProject]);
  const data = location?.state?.data as DataProps;
  //전체 탭들 목록
  const tabs = [
    "Ship detection",
    "Custom detection",
    "Super resolution",
    "Compression",
    "Inpainting",
  ];

  const [currentTab, setCurrentTab] = useState<string>("");

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

  // 새로고침 시에 화면 유지되도록 세션스토리지 활용
  useEffect(() => {
    if (data) {
      // data가 존재하면 세션 스토리지에 저장
      sessionStorage.setItem("project", data.projectName);
      sessionStorage.setItem("location", data.locationName);
      sessionStorage.setItem("longitude", data.longitude.toString());
      sessionStorage.setItem("latitude", data.latitude.toString());
      setCurrentTab(data.projectName);
      setCurrentProject(data.projectName);
      navigate(`${data.projectName.replace(/(\s*)/g, "").toLowerCase()}`);
    } else {
      // data가 없으면 세션 스토리지에서 데이터 가져오기
      const storedProject = sessionStorage.getItem("project");
      const storedLocation = sessionStorage.getItem("location");
      const storedLongitude = sessionStorage.getItem("longitude");
      const storedLatitude = sessionStorage.getItem("latitude");
      if (
        storedProject &&
        storedLongitude &&
        storedLatitude &&
        storedLocation
      ) {
        setCurrentProject(storedProject);
        setCurrentTab(storedProject);
        navigate(`${storedProject.replace(/(\s*)/g, "").toLowerCase()}`);
      } else {
        navigate("/"); // 세션 스토리지에도 데이터가 없으면 메인 화면으로 이동
      }
    }
  }, [data, navigate]);

  return (
    <>
      <ProjectsContainer>
        <Tab
          tabs={tabs}
          // setTabs={setTabs}
          currentTab={currentTab}
        />
        {/* project 컴포넌트들 */}
        <Outlet />
        {!isNotRightSideBar && <RightSideBar />}
      </ProjectsContainer>
    </>
  );
};

export default ProjectPage;
