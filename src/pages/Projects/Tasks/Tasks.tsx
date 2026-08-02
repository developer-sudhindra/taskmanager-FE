import { useNavigate } from "react-router-dom";
import { TaskCard } from "../TaskCard/TaskCard";
import {
  useGetAllTasksQuery,
  usePrefetch,
} from "../../../features/tasks/tasksApi";
import { skipToken } from "@reduxjs/toolkit/query/react";

interface TasksProps {
  projectId: string;
}

export const Tasks = ({ projectId }: TasksProps) => {
  const navigate = useNavigate();

  // const { data, isLoading } = useGetAllTasks(projectId);
  console.log("projectId", projectId, !projectId);
  const {
    data: response,
    isLoading,
    error,
  } = useGetAllTasksQuery(projectId ?? skipToken);

  const prefetchTaskDetails = usePrefetch("getOneTask");

  const redirectToTaskDetails = (taskId) => {
    navigate(`/projects/${projectId}/tasks/${taskId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Some error</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="min-h-svh bg-surface rounded-md p-[16px]">
        <div className="font-bold mb-3 text-center">TO DO</div>
        {response?.data
          ?.filter((task) => task.status === "OPEN")
          .map((task) => (
            <span
              onMouseEnter={() =>
                prefetchTaskDetails(task.id, { force: false })
              }
            >
              <TaskCard
                onSelectTask={redirectToTaskDetails}
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
              />
            </span>
          ))}
      </div>
      <div className="min-h-svh bg-surface rounded-md p-[16px]">
        <div className="font-bold mb-3 text-center">IN PROGRESS</div>
        {response?.data
          ?.filter((task) => task.status === "IN_PROGRESS")
          .map((task) => (
            <span
              onMouseEnter={() =>
                prefetchTaskDetails(task.id, { force: false })
              }
            >
              <TaskCard
                onSelectTask={redirectToTaskDetails}
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
              />
            </span>
          ))}
      </div>
      <div className="min-h-svh bg-surface rounded-md p-[16px]">
        <div className="font-bold mb-3 text-center">DONE</div>
        {response?.data
          ?.filter((task) => task.status === "DONE")
          .map((task) => (
            <span
              onMouseEnter={() =>
                prefetchTaskDetails(task.id, { force: false })
              }
            >
              <TaskCard
                onSelectTask={redirectToTaskDetails}
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
              />
            </span>
          ))}
      </div>
    </div>
  );
};
