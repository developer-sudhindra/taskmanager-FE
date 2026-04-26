// src/app/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";

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
        <div>Projects</div>
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
