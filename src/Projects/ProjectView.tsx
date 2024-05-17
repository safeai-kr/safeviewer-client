import React, { useState } from "react";
import { Tab } from "../Header/Tab";
import { useLocation } from "react-router-dom";

interface DataProps {
  name: string;
  content: string;
}
const ProjectView: React.FC = () => {
  const location = useLocation();
  console.log(location);
  const { name, content } = location?.state.data as DataProps;
  const [currentProject, setCurrentProject] = useState<string>("");
  return (
    <>
      <Tab name={name} />
      <div>{content}</div>
    </>
  );
};

export default ProjectView;
