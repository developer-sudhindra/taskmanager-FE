import { useActionState, useEffect, useCallback } from "react";
import { Button } from "../../../shared/ui/button/button";
import { Input } from "../../../shared/ui/Input/Input";
import { Textarea } from "../../../shared/ui/Textarea/Textarea";
import { PageTitle } from "../../../shared/ui/PageTitle/PageTitle";
import { useParams, useNavigate } from "react-router-dom";
import { Select } from "../../../shared/ui/Select/Select";
import { useCreateTask } from "../../../hooks/useTasks";

type Priority = "LOW" | "MEDIUM" | "HIGH";

type TaskType = "TASK" | "FEATURE" | "BUG";

interface CreateTaskStage {
  success: boolean;
  values: {
    title: string;
    titleError: string;
    description: string;
    descriptionError: string;
    priority: Priority;
    type: TaskType;
  };
}

const createProjectInitalState: CreateTaskStage = {
  success: false,
  values: {
    title: "",
    titleError: "",
    description: "",
    descriptionError: "",
    priority: "LOW",
    type: "TASK",
  },
};

export const CreateTask = () => {
  const { projectId } = useParams();
  const { mutateAsync, isPending: isMutating } = useCreateTask();
  const navigate = useNavigate();

  const formAction = useCallback(
    async (
      projectId: string | undefined,
      previousState: CreateTaskStage,
      formData: FormData,
    ) => {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const priority = formData.get("priority") as string;
      const taskType = formData.get("type") as string;

      const errors = {
        titleError: "",
        descriptionError: "",
      };

      if (title.length < 3) {
        errors.titleError = "Title must be greater than 3 character";
      }

      if (description.trim().length < 3) {
        errors.descriptionError =
          "description shoul be greater than 3 characters";
      }

      if (Object.values(errors).some(Boolean)) {
        return {
          success: false,
          values: {
            title: title,
            description: description,
            priority: priority,
            type: taskType,
            ...errors,
          },
        };
      }

      try {
        const payload = {
          title: title,
          description: description,
          status: "OPEN",
          projectId: projectId,
          priority: priority,
          type: taskType,
          labels: [
            {
              name: "New Label",
            },
          ],
        };

        await mutateAsync(payload);

        return {
          success: true,
          values: {
            title: title,
            description: description,
            priority: priority,
            type: taskType,
            titleError: "",
            descriptionError: "",
          },
        };
      } catch (error) {
        return {
          success: false,
          values: {
            title: title,
            description: description,
            priority: priority,
            type: taskType,
            titleError: "Failed to create task",
            descriptionError: "",
          },
        };
      }
    },
    [],
  );

  const boundFormAction = formAction.bind(null, projectId);

  const [state, createFormAction, isActionPending] = useActionState(
    boundFormAction,
    createProjectInitalState,
  );

  useEffect(() => {
    if (state.success) {
      navigate(`/projects/${projectId}`);
    }
  }, [state.success]);

  const isPending = isMutating || isActionPending;

  return (
    <div className="border border-surface rounded-md p-[16px]">
      <PageTitle>Create New Task</PageTitle>
      <form action={createFormAction}>
        <label>Title</label>
        <Input
          placeholder="Task Title"
          name="title"
          defaultValue={state.values.title}
        />
        <label>Description</label>
        <Textarea
          placeholder="Task Description"
          name="description"
          defaultValue={state.values.description}
        />
        <label>Priority</label>
        <Select name="priority" defaultValue={state.values.priority}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>
        <label>Task Type</label>
        <Select name="type" defaultValue={state.values.type}>
          <option value="FEATURE">Feature</option>
          <option value="BUG">Bug</option>
          <option value="TASK">TASK</option>
        </Select>
        <div className="flex align-center justify-end gap-[10px] mt-[20px]">
          <Button variant="outline" onClick={() => navigate(-1)} type="button">
            Go Back
          </Button>
          <Button variant="primary" type="submit" disabled={isPending}>
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
};
