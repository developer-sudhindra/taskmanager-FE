import { Button } from "../../../shared/ui/button/button";
import { Input } from "../../../shared/ui/Input/Input";
import { Textarea } from "../../../shared/ui/Textarea/Textarea";
import { PageTitle } from "../../../shared/ui/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
export const CreateProject = () => {
  const navigate = useNavigate();

  const redirectToPath = (path: string) => {
    navigate(path);
  };

  const createProject = () => {
    // Logic to create a new project
  };

  return (
    <div>
      <PageTitle>Create New Project</PageTitle>
      <form>
        <div className="mb-6">
          <label>Project Name</label>
          <Input placeholder="Project Name" />
        </div>
        <div className="mb-6">
          <label>Project Description</label>
          <Textarea placeholder="Project Description" />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => redirectToPath("/projects")}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button onClick={createProject} variant="primary">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};
