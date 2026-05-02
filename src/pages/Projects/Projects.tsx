import { Button } from "../../shared/ui/button/button";
import { useNavigate } from "react-router-dom";

export const Projects = () => {
  const navigate = useNavigate();
  const redirectToCreateProject = () => {
    navigate("/projects/create");
  };

  const getAllProjects = () => {
    fetch("http://localhost:3000/projects")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div>
      <div>
        <Button onClick={redirectToCreateProject} variant="primary">
          Create Project
        </Button>
      </div>
    </div>
  );
};
