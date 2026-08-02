import { useEffect, useActionState, useCallback, useId } from "react";
import { Button } from "../../../shared/ui/button/button";
import { Input } from "../../../shared/ui/Input/Input";
import { Textarea } from "../../../shared/ui/Textarea/Textarea";
import { PageTitle } from "../../../shared/ui/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { useCreateProjectMutation } from "../../../features/project/projectApi";

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

export const CreateProject = () => {
  const navigate = useNavigate();
  // const { mutateAsync, isPending: isMutating } = useCreateProject();
  const [createProjectMutation, { isLoading: isMutating }] =
    useCreateProjectMutation();
  const baseId = useId();

  const updateFormAction = useCallback(
    async (_, formData: FormData) => {
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

        await createProjectMutation(payload).unwrap();

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
    },
    [createProjectMutation],
  );

  const [state, updateAction, isActionPending] = useActionState(
    updateFormAction,
    createProjectInitialState,
  );

  useEffect(() => {
    if (state.success) {
      navigate("/projects");
    }
  }, [state.success]);

  const isPending = isActionPending || isMutating;

  return (
    <>
      <PageTitle>Create New Project</PageTitle>
      {state.values.projectNameError && (
        <p className="text-red-500 text-sm mb-2">
          {state.values.projectNameError}
        </p>
      )}
      {state.values.descriptionError && (
        <p className="text-red-500 text-sm mb-2">
          {state.values.descriptionError}
        </p>
      )}
      <form action={updateAction}>
        <div className="mb-6">
          <label htmlFor={`projedtName_${baseId}`}>Project Name</label>
          <Input
            id={`projedtName_${baseId}`}
            placeholder="Project Name"
            name="projectName"
            defaultValue={state.values.projectName}
          />
        </div>
        <div className="mb-6">
          <label htmlFor={`projectDescription_${baseId}`}>
            Project Description
          </label>
          <Textarea
            id={`projectDescription_${baseId}`}
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
