// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import { Projects } from "../pages/Projects/Projects";
import { CreateProject } from "../pages/Projects/CreateProject/CreateProject";

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
    path: "/projects",
    element: (
      <Layout>
        <Projects />
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
        <div>Settings</div>
      </Layout>
    ),
  },
]);

export default router;
