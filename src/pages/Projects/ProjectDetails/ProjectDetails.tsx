import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui/button/button";
import { Tasks } from "../Tasks/Tasks";
import { useGetProjectDetailsQuery } from "../../../features/project/projectApi";
import { skipToken } from "@reduxjs/toolkit/query";

export const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetProjectDetailsQuery(
    projectId ?? skipToken,
  );

  const redirectToProjects = () => {
    navigate("/projects");
  };

  const redirectToCreateTask = () => {
    navigate(`/projects/${projectId}/tasks/create`);
  };

  const redirectToUpdateProjectMembers = () => {
    navigate(`/projects/${projectId}/project-members`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mb-[30px] flex flex-row align-center justify-between">
        <div className="flex flex-row gap-4">
          <Button variant="outline" onClick={redirectToProjects}>
            Go Back
          </Button>
          <div className="mb-[15px]">{data?.name}</div>
        </div>
        <div className="flex flex-row gap-4">
          <Button variant="outline" onClick={redirectToUpdateProjectMembers}>
            Update Project members
          </Button>
          <Button variant="primary" onClick={redirectToCreateTask}>
            Create Task
          </Button>
        </div>
      </div>
      <Tasks projectId={projectId} swimlanes={data.swimlanes} />
    </>
  );
};
