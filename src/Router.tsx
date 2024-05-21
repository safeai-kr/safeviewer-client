import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MapView from "./Map/MapView";
import SignUp from "./Login/SignUp";
import Login from "./Login/Login";
import NAuthLayout from "./Layout/NAuthLayout";
import AuthLayout from "./Layout/AuthLayout";
import Projects from "./Projects/Projects";
import ProjectView from "./Projects/ProjectView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NAuthLayout />,
    children: [
      { path: "/", element: <Login /> },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "main",
        element: <MapView />,
      },
      {
        path: "projects",
        element: <Projects />,
        children: [
          {
            path: ":id",
            element: <ProjectView />,
          },
        ],
      },
    ],
  },
]);

export default router;
