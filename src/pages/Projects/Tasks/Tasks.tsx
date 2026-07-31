import { useNavigate } from "react-router-dom";
import { TaskCard } from "../TaskCard/TaskCard";
import {
  useGetAllTasks,
  usePrefetchTaskDetails,
} from "../../../hooks/useTasks";

interface TasksProps {
  projectId: string;
}

export const Tasks = ({ projectId }: TasksProps) => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetAllTasks(projectId);

  const prefetchTaskDetails = usePrefetchTaskDetails();

  const redirectToTaskDetails = (taskId) => {
    navigate(`/projects/${projectId}/tasks/${taskId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="min-h-svh bg-surface rounded-md p-[16px]">
        <div className="font-bold mb-3 text-center">TO DO</div>
        {data
          ?.filter((task) => task.status === "OPEN")
          .map((task) => (
            <span onMouseEnter={() => prefetchTaskDetails(task.id)}>
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
        {data
          ?.filter((task) => task.status === "IN_PROGRESS")
          .map((task) => (
            <span onMouseEnter={() => prefetchTaskDetails(task.id)}>
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
        {data
          ?.filter((task) => task.status === "DONE")
          .map((task) => (
            <span onMouseEnter={() => prefetchTaskDetails(task.id)}>
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
