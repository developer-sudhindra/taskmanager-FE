import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui/button/button";
import { Tasks } from "../Tasks/Tasks";

export const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/project/${projectId}`)
      .then((response) => response.json())
      .then((data) => setProject(data));
  }, []);

  const redirectToProjects = () => {
    navigate("/projects");
  };

  const redirectToCreateTask = () => {
    navigate(`/projects/${projectId}/tasks/create`);
  };

  return (
    <>
      <div className="mb-[30px] flex flex-row align-center justify-between">
        <Button variant="outline" onClick={redirectToProjects}>
          Go Back
        </Button>
        <Button variant="primary" onClick={redirectToCreateTask}>
          Create Task
        </Button>
      </div>
      {/* <div className="border border-surface rounded-md p-4 flex flex-row align-center justify-start gap-[30px]">
        <div>
          <div className="text-[12px] text-[grey]">Name:</div>
          <div className="mb-[15px]">{project?.name}</div>
        </div>
        <div>
          <div className="text-[12px] text-[grey]">Status:</div>
          <div className="mb-[15px]">{"Active"}</div>
        </div>
      </div> */}
      <Tasks projectId={projectId} />
    </>
  );
};
