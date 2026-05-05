import { useState } from "react";
import { Button } from "../../../shared/ui/button/button";
import { Input } from "../../../shared/ui/Input/Input";
import { Textarea } from "../../../shared/ui/Textarea/Textarea";
import { PageTitle } from "../../../shared/ui/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
export const CreateProject = () => {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const redirectToPath = (path: string) => {
    navigate(path);
  };

  const resetForm = () => {
    setProjectName("");
    setDescription("");
  };

  const updateInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "projectName") {
      setProjectName(value);
    } else if (name === "description") {
      setDescription(value);
    }
  };

  const createProject = () => {
    fetch("http://localhost:3000/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        description: description,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        resetForm();
        redirectToPath("/projects");
      })
      .catch((error) => {
        console.error("Error creating project:", error);
      });
  };
  9;
  return (
    <div>
      <PageTitle>Create New Project</PageTitle>
      <form>
        <div className="mb-6">
          <label>Project Name</label>
          <Input
            placeholder="Project Name"
            name="projectName"
            value={projectName}
            onChange={updateInput}
          />
        </div>
        <div className="mb-6">
          <label>Project Description</label>
          <Textarea
            placeholder="Project Description"
            name="description"
            value={description}
            onChange={updateInput}
          />
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
