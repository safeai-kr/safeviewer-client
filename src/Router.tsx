import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MapView from "./Features/Map/components/MapView";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NAuthLayout from "./Features/Layout/NAuthLayout";
import AuthLayout from "./Features/Layout/AuthLayout";
import Projects from "./Features/Projects/Projects";
import ProjectView from "./Features/Projects/Project";
import MainMap from "./pages/MainMap";

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
