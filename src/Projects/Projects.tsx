import React, { useEffect, useState } from "react";
import { Tab } from "../Header/Tab";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import styled from "styled-components";

interface DataProps {
  name: string;
  content: string;
  longitude: number;
  latitude: number;
}
const ProjectsContainer = styled.div`
  position: relative;
  height: calc(100vh - 68px);
`;
const Projects: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location?.state?.data as DataProps;

  //맨 처음 프로젝트 화면 로딩 상태
  const [initialized, setInitialized] = useState<boolean>(false);
  //전체 탭들 목록
  const [tabs, setTabs] = useState<DataProps[]>([]);
  //현재 선택된 탭
  const [currentTab, setCurrentTab] = useState<number>(1);

  //메인에서 프로젝트 화면 들어갈 때 탭 추가
  useEffect(() => {
    if (!initialized) {
      setTabs((prevTabs) => [
        ...prevTabs,
        {
          name: data?.name,
          content: data?.content,
          longitude: data?.longitude,
          latitude: data?.latitude,
        },
      ]);
    }
    setInitialized(true);
    navigate(`/auth/projects/${currentTab}`, {
      state: { longitude: data?.longitude, latitude: data?.latitude },
    });
  }, [initialized, data]);

  useEffect(() => {
    //새로 생긴 탭 선택
    if (tabs.length > 0) {
      setCurrentTab(tabs.length);
    }
    //탭을 모두 지웠을 때 다시 메인화면으로
    if (tabs.length === 0 && !data) {
      navigate("/auth/main");
    }
  }, [tabs]);

  //프로젝트 화면에서 다른 프로젝트를 더 추가할 때 탭 추가(예정)

  return (
    <>
      <ProjectsContainer>
        <Tab
          tabs={tabs}
          setTabs={setTabs}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        {/* projectview 컴포넌트 */}
        <Outlet />
        <RightSideBar />
      </ProjectsContainer>
    </>
  );
};

export default Projects;
