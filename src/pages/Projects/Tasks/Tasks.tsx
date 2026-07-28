import { useEffect, useState } from "react";
import { TaskCard } from "../TaskCard/TaskCard";
import { useNavigate } from "react-router-dom";
import { getAllTask } from "../project.service";

interface TasksProps {
  projectId: string;
}

export const Tasks = ({ projectId }: TasksProps) => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getAllTask(projectId)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      });
  }, [projectId]);

  const redirectToTaskDetails = (taskId) => {
    navigate(`/projects/${projectId}/tasks/${taskId}`);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="min-h-svh bg-surface rounded-md p-[16px]">
        <div className="font-bold mb-3 text-center">TO DO</div>
        {tasks
          .filter((task) => task.status === "OPEN")
          .map((task) => (
            <TaskCard
              onSelectTask={redirectToTaskDetails}
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
            />
          ))}
      </div>
      <div className="min-h-svh bg-surface rounded-md p-[16px]">
        <div className="font-bold mb-3 text-center">IN PROGRESS</div>
        {tasks
          .filter((task) => task.status === "IN_PROGRESS")
          .map((task) => (
            <TaskCard
              onSelectTask={redirectToTaskDetails}
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
            />
          ))}
      </div>
      <div className="min-h-svh bg-surface rounded-md p-[16px]">
        <div className="font-bold mb-3 text-center">DONE</div>
        {tasks
          .filter((task) => task.status === "DONE")
          .map((task) => (
            <TaskCard
              onSelectTask={redirectToTaskDetails}
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
            />
          ))}
      </div>
    </div>
  );
};
