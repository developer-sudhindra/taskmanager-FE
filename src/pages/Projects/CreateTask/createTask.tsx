import { useEffect, useActionState, useCallback, useId } from "react";
import { Button } from "../../../shared/ui/button/button";
import { Input } from "../../../shared/ui/Input/Input";
import { Textarea } from "../../../shared/ui/Textarea/Textarea";
import { PageTitle } from "../../../shared/ui/PageTitle/PageTitle";
import { useParams, useNavigate } from "react-router-dom";
import { Select } from "../../../shared/ui/Select/Select";
import { useCreateTaskMutation } from "../../../features/tasks/tasksApi";
import { ErrorMessages } from "../../../shared/ui/ErrorMessage/ErrorMessage";
import { useGetAllProjectMemberQuery } from "../../../features/project/projectApi";
import { skipToken } from "@tanstack/react-query";

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
    createdBy: string;
    assignedTo: string;
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
    createdBy: "",
    assignedTo: "",
  },
};

export const CreateTask = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    data: members = [],
    isLoading,
    error,
  } = useGetAllProjectMemberQuery(projectId ?? skipToken);
  const [createTaskMutation, { isLoading: isMutating }] =
    useCreateTaskMutation();
  const navigate = useNavigate();
  const baseId = useId();
  console.log(members);
  const formAction = useCallback(
    async (
      projectId: string | undefined,
      previousState: CreateTaskStage,
      formData: FormData,
    ) => {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const priority = formData.get("priority") as Priority;
      const taskType = formData.get("type") as TaskType;
      const createdBy = formData.get("createdBy");
      const assignedTo = formData.get("assignedTo");

      const errors = {
        titleError: "",
        descriptionError: "",
      };

      if (title.length < 3) {
        errors.titleError = "Title must be greater than 3 characters";
      }

      if (description.trim().length < 3) {
        errors.descriptionError =
          "Description should be greater than 3 characters";
      }

      if (Object.values(errors).some(Boolean)) {
        return {
          success: false,
          values: {
            title,
            description,
            priority,
            type: taskType,
            ...errors,
          },
        };
      }

      try {
        const payload = {
          title,
          description,
          status: "OPEN",
          projectId,
          priority,
          type: taskType,
          createdBy,
          assignedTo,
          labels: [{ name: "New Label" }],
        };

        await createTaskMutation(payload).unwrap();

        return {
          success: true,
          values: {
            title,
            description,
            priority,
            type: taskType,
            titleError: "",
            createdBy,
            assignedTo,
            descriptionError: "",
          },
        };
      } catch (error) {
        return {
          success: false,
          values: {
            title,
            description,
            priority,
            type: taskType,
            createdBy,
            assignedTo,
            titleError: "Failed to create task",
            descriptionError: "",
          },
        };
      }
    },
    [createTaskMutation],
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
  }, [state.success, navigate, projectId]);

  const isPending = isMutating || isActionPending;

  let assignedToDropdown = null;
  if (members && members.length > 0) {
    assignedToDropdown = members.map((member) => {
      const { user } = member;
      const { status } = user;
      return (
        status === "ACTIVE" && <option value={user.name}>{user.name}</option>
      );
    });
  }

  return (
    <div className="w-full bg-bg p-6 flex flex-col items-center justify-start md:pt-12">
      <div className="w-full max-w-2xl bg-surface border border-border rounded-xl shadow-md p-8 transition-colors duration-200">
        <div className="mb-8 border-b border-border pb-4">
          <PageTitle>
            <span className="text-text font-bold tracking-tight">
              Create New Task
            </span>
          </PageTitle>
          <p className="text-sm text-muted mt-1">
            Add operational details, priority weight, and type metrics for this
            workflow ticket
          </p>
        </div>

        <form action={createFormAction} className="space-y-5">
          <div className="flex flex-col">
            <label
              htmlFor={`taskTitle_${baseId}`}
              className="block text-sm font-semibold text-text mb-1.5"
            >
              Title
            </label>
            <Input
              id={`taskTitle_${baseId}`}
              placeholder="Task Title"
              name="title"
              defaultValue={state.values.title}
              disabled={isPending}
              className="w-full"
            />
            {state.values.titleError.length > 0 && (
              <div className="mt-1">
                <ErrorMessages>{state.values.titleError}</ErrorMessages>
              </div>
            )}
          </div>

          {/* Description Field Layout Wrapper */}
          <div className="flex flex-col">
            <label
              htmlFor={`taskDesc_${baseId}`}
              className="block text-sm font-semibold text-text mb-1.5"
            >
              Description
            </label>
            <Textarea
              id={`taskDesc_${baseId}`}
              placeholder="Task Description"
              name="description"
              defaultValue={state.values.description}
              disabled={isPending}
              rows={4}
              className="w-full"
            />
            {state.values.descriptionError.length > 0 && (
              <div className="mt-1">
                <ErrorMessages>{state.values.descriptionError}</ErrorMessages>
              </div>
            )}
          </div>

          {/* Dropdowns Configuration Row Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Priority Column Element */}
            <div className="flex flex-col">
              <label
                htmlFor={`taskPriority_${baseId}`}
                className="block text-sm font-semibold text-text mb-1.5"
              >
                Priority
              </label>
              <Select
                id={`taskPriority_${baseId}`}
                name="priority"
                defaultValue={state.values.priority}
                disabled={isPending}
                className="w-full"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </Select>
            </div>

            {/* Task Type Column Element */}
            <div className="flex flex-col">
              <label
                htmlFor={`taskType_${baseId}`}
                className="block text-sm font-semibold text-text mb-1.5"
              >
                Task Type
              </label>
              <Select
                id={`taskType_${baseId}`}
                name="type"
                defaultValue={state.values.type}
                disabled={isPending}
                className="w-full"
              >
                <option value="TASK">Task</option>
                <option value="FEATURE">Feature</option>
                <option value="BUG">Bug</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Priority Column Element */}
            <div className="flex flex-col">
              <label
                htmlFor={`createdBy_${baseId}`}
                className="block text-sm font-semibold text-text mb-1.5"
              >
                Created by
              </label>
              <Select
                id={`createdBy_${baseId}`}
                name="createdBy"
                defaultValue={state.values.createdBy}
                disabled={isPending}
                className="w-full"
              >
                {assignedToDropdown}
              </Select>
            </div>

            {/* Task Type Column Element */}
            <div className="flex flex-col">
              <label
                htmlFor={`assignedTo_${baseId}`}
                className="block text-sm font-semibold text-text mb-1.5"
              >
                Assigned To
              </label>
              <Select
                id={`assignedTo_${baseId}`}
                name="assignedTo"
                defaultValue={state.values.assignedTo}
                disabled={isPending}
                className="w-full"
              >
                {assignedToDropdown}
              </Select>
            </div>
          </div>

          {/* Footer Control Panel Bar Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border mt-8">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              type="button"
              disabled={isPending}
            >
              Go Back
            </Button>

            <Button variant="primary" type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
