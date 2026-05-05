import { useEffect, useState } from "react";
import { Button } from "../../shared/ui/button/button";
import { useNavigate } from "react-router-dom";
import { ProjectCards } from "./ProjectCards/ProjectCards";

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProjects();
  }, []);

  const redirectToCreateProject = () => {
    navigate("/projects/create");
  };

  const redirectToProjectDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const getAllProjects = () => {
    fetch("http://localhost:3000/project")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      });
  };

  return (
    <div>
      <div>
        <Button onClick={redirectToCreateProject} variant="primary">
          Create Project
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {projects.map((project) => (
          <ProjectCards
            key={project.id}
            project={project}
            onSelectProject={redirectToProjectDetails}
          />
        ))}
      </div>
    </div>
  );
};
