import { useEffect, useState } from "react";
import { Button } from "../../../shared/ui/button/button";
import { Input } from "../../../shared/ui/Input/Input";
import { Textarea } from "../../../shared/ui/Textarea/Textarea";
import { Select } from "../../../shared/ui/Select/Select";
import { PageTitle } from "../../../shared/ui/PageTitle/PageTitle";
import { useParams, useNavigate } from "react-router-dom";

import {
  useGetOneTask,
  useUpdateTask,
  useDeleteTask,
} from "../../../hooks/useTasks";

export const UpdateTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const { mutateAsync: updateTaskMutation, isPending: isUpdating } =
    useUpdateTask();
  const { data: taskData, isLoading } = useGetOneTask(taskId);
  const { mutate: deleteTaskMutate, isPending: isDeleting } = useDeleteTask();

  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    if (taskData) {
      setTask(taskData);
    }
  }, [taskData]);

  const updateTaskObj = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleUpdateTask = async () => {
    if (!taskId || !task) return;
    const updatedTask = {
      ...task,
      labels: [{ name: "New update Label" }],
    };
    try {
      await updateTaskMutation({ taskId, payload: updatedTask });
      navigate(-1);
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const deleteTask = () => {
    if (!task || !taskId) return;
    try {
      deleteTaskMutate(taskId);
    } catch (error) {
      console.log(`Failed while deleteing the task`, error);
    }
  };

  if (isLoading || !task) return <div>Loading task data...</div>;

  const isPending = isUpdating || isDeleting;

  return (
    <div>
      <div className="flex flex-row align-center justify-between mb-[30px]">
        <PageTitle>Update Task</PageTitle>
        <div>
          <Button
            disabled={isPending}
            type="button"
            variant="danger"
            onClick={deleteTask}
          >
            Delete Task
          </Button>
        </div>
      </div>
      <form className="border border-surface rounded-md p-[16px]">
        <label>Title</label>
        <Input
          placeholder="Task Title"
          name="title"
          value={task?.title}
          onChange={updateTaskObj}
        />
        <label>Description</label>
        <Textarea
          placeholder="Task Description"
          name="description"
          value={task?.description}
          onChange={updateTaskObj}
        />
        <label>Status</label>
        <Select name="status" value={task?.status} onChange={updateTaskObj}>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Select>
        <label>Priority</label>
        <Select name="priority" value={task?.priority} onChange={updateTaskObj}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>
        <label>Task Type</label>
        <Select name="type" value={task?.type} onChange={updateTaskObj}>
          <option value="FEATURE">Feature</option>
          <option value="BUG">Bug</option>
          <option value="TASK">Task</option>
          <option value="DOCUMENTATION">Documentation</option>
        </Select>
        <div className="flex items-center justify-end gap-3 mt-[15px]">
          <Button
            disabled={isPending}
            variant="primary"
            onClick={handleUpdateTask}
            type="button"
          >
            Update Task
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} type="button">
            Go Back
          </Button>
        </div>
      </form>
    </div>
  );
};
