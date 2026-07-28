import { useEffect, useActionState } from "react";
import { Button } from "../../../shared/ui/button/button";
import { Input } from "../../../shared/ui/Input/Input";
import { Textarea } from "../../../shared/ui/Textarea/Textarea";
import { PageTitle } from "../../../shared/ui/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { createProjectAPI } from "../project.service";

interface CreateProjectState {
  success: boolean;
  values: {
    projectName: string;
    projectNameError: string;
    description: string;
    descriptionError: string;
  };
}

const createProjectInitialState: CreateProjectState = {
  success: false,
  values: {
    projectName: "",
    projectNameError: "",
    description: "",
    descriptionError: "",
  },
};

const updateFormAction = async (
  previousState: CreateProjectState,
  formData: FormData,
) => {
  const projectName = formData.get("projectName") as string;
  const projetDescription = formData.get("description") as string;

  const errors = {
    projectNameError: "",
    descriptionError: "",
  };

  if (projectName.length < 2) {
    errors.projectNameError = "Invalid project name";
  }

  if (projetDescription.length < 2) {
    errors.descriptionError = "Invalid project description";
  }

  if (Object.values(errors).some(Boolean)) {
    return {
      success: false,
      values: {
        projectName: projectName,
        description: projetDescription,
        ...errors,
      },
    };
  }

  try {
    const payload = {
      name: projectName,
      description: projetDescription,
    };

    const response = await createProjectAPI(payload);

    if (!response.ok) {
      return {
        success: false,
        values: {
          projectName: projectName,
          description: projetDescription,
          projectNameError: "",
          descriptionError: "Failed to create project",
        },
      };
    }

    return {
      success: true,
      values: {
        projectName: projectName,
        description: projetDescription,
        projectNameError: "",
        descriptionError: "",
      },
    };
  } catch (error) {
    return {
      success: false,
      values: {
        projectName: projectName,
        description: projetDescription,
        projectNameError: "",
        descriptionError: "Failed to create project",
      },
    };
  }
};

export const CreateProject = () => {
  const navigate = useNavigate();
  const [state, updateAction, isPending] = useActionState(
    updateFormAction,
    createProjectInitialState,
  );

  useEffect(() => {
    if (state.success) {
      navigate("/projects");
    }
  }, [state.success]);

  return (
    <>
      <PageTitle>Create New Project</PageTitle>
      {state.values.projectNameError}
      {state.values.descriptionError}
      <form action={updateAction}>
        <div className="mb-6">
          <label>Project Name</label>
          <Input
            placeholder="Project Name"
            name="projectName"
            defaultValue={state.values.projectName}
          />
        </div>
        <div className="mb-6">
          <label>Project Description</label>
          <Textarea
            placeholder="Project Description"
            name="description"
            defaultValue={state.values.description}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={() => navigate("/projects")}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} variant="primary">
            Create
          </Button>
        </div>
      </form>
    </>
  );
};
