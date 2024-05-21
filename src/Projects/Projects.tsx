import React, { useState } from "react";
import { Tab } from "../Header/Tab";
import { useLocation } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import styled from "styled-components";

interface DataProps {
  name: string;
  content: string;
}
const ProjectContainer = styled.div`
  position: relative;
  height: calc(100vh - 68px);
`;
const Projects: React.FC = () => {
  const location = useLocation();
  console.log(location);
  const data = location?.state.data as DataProps;
  const [currentProject, setCurrentProject] = useState<string>("");
  return (
    <>
      <ProjectContainer>
        <Tab data={data} />
        <div>{data.content}</div>
        <RightSideBar />
      </ProjectContainer>
    </>
  );
};

export default Projects;
