// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import { Projects } from "../pages/Projects/Projects";
import { CreateProject } from "../pages/Projects/CreateProject/CreateProject";
import { CreateTask } from "../pages/Projects/CreateTask/createTask";
import { ProjectDetails } from "../pages/Projects/ProjectDetails/ProjectDetails";
import { UpdateTask } from "../pages/Projects/UpdateTask/UpdateTask";
import { Login } from "../pages/Auth/Login/Login";
import { Register } from "../pages/Auth/Register/Register";
import { UpdatePassword } from "../pages/Auth/UpdatePassword/UpdatePassword";
import { Settings } from "../pages/Settings/Settings";
import { AddProjectMember } from "../pages/Projects/ProjectMember/AddProjectMember/AddProjectMember";
import { UpdateGostPassword } from "../pages/Auth/UpdateGostPassword/UpdateGostPassword";
import { ProjectMember } from "../pages/ProjetMember/ProjectMember";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <div>Dashboard</div>
      </Layout>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/update-gost-password/:emailId",
    element: <UpdateGostPassword />,
  },
  {
    path: "/update-password",
    element: <UpdatePassword />,
  },
  {
    path: "/projects",
    element: (
      <Layout>
        <Projects />
      </Layout>
    ),
  },
  {
    path: "/projects/:projectId",
    element: (
      <Layout>
        <ProjectDetails />
      </Layout>
    ),
  },
  {
    path: "/projects/:projectId/project-members",
    element: (
      <Layout>
        <ProjectMember />
      </Layout>
    ),
  },
  {
    path: "/projects/:projectId/project-member/add",
    element: (
      <Layout>
        <AddProjectMember />
      </Layout>
    ),
  },
  {
    path: "/projects/create",
    element: (
      <Layout>
        <CreateProject />
      </Layout>
    ),
  },
  {
    path: "/projects/:projectId/tasks/create",
    element: (
      <Layout>
        <CreateTask />
      </Layout>
    ),
  },
  {
    path: "/projects/:projectId/tasks/:taskId",
    element: (
      <Layout>
        <UpdateTask />
      </Layout>
    ),
  },
  {
    path: "/calendar",
    element: (
      <Layout>
        <div>Calendar</div>
      </Layout>
    ),
  },
  {
    path: "/settings",
    element: (
      <Layout>
        <Settings />
      </Layout>
    ),
  },
]);

export default router;
