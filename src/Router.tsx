import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MapView from "./Features/Map/Component/MapView";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import NAuthLayout from "./Features/Layout/NAuthLayout";
import AuthLayout from "./Features/Layout/AuthLayout";
import ProjectView from "./Features/Projects/CustomDetection";
import MainMap from "./Pages/MainMap";
import ProjectPage from "./Pages/ProjectPage";
import ShipDetection from "./Features/Projects/ShipDetection";
import CustomDetection from "./Features/Projects/CustomDetection";
import SuperResolution from "./Features/Projects/SuperResolution";
import Compression from "./Features/Projects/Compression";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <NAuthLayout />,
  //   children: [
  //     { path: "/", element: <Login /> },
  //     {
  //       path: "signup",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <MainMap />,
      },
      {
        path: "project",
        element: <ProjectPage />,
        children: [
          {
            path: "shipdetection",
            element: <ShipDetection />,
          },
          {
            path: "customdetection",
            element: <CustomDetection />,
          },
          {
            path: "superresolution",
            element: <SuperResolution />,
          },
          {
            path: "compression",
            element: <Compression />,
          },
        ],
      },
    ],
  },
]);

export default router;
