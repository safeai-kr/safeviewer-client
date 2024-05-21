import React from "react";
import { useParams } from "react-router-dom";

const ProjectView = () => {
  const { id } = useParams<{ id: string }>();

  return <div>Project View for Tab {id}</div>;
};

export default ProjectView;
