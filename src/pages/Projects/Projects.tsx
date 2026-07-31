import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/ui/button/button";
import { ProjectCards } from "./ProjectCards/ProjectCards";
import {
  useProjects,
  usePrefetchProjectDetails,
} from "../../hooks/useProjects";

export const Projects = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useProjects();

  const prefetchProjectDetail = usePrefetchProjectDetails();

  const redirectToCreateProject = () => {
    navigate("/projects/create");
  };

  const redirectToProjectDetails = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div>
        <Button onClick={redirectToCreateProject} variant="primary">
          Create Project
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {data &&
          data.map((project) => (
            <span
              onMouseEnter={() => {
                prefetchProjectDetail(project.id);
              }}
            >
              <ProjectCards
                key={project.id}
                project={project}
                onSelectProject={redirectToProjectDetails}
              />
            </span>
          ))}
      </div>
    </div>
  );
};
