import { useEffect, useState } from "react";
import { TaskCard } from "../TaskCard/TaskCard";

interface TasksProps {
  projectId: string;
}

export const Tasks = ({ projectId }: TasksProps) => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:3000/tasks/project/${projectId}`)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      });
  }, [projectId]);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="min-h-svh bg-surface rounded-md p-[16px]">
        <div className="font-bold mb-3 text-center">TO DO</div>
        {tasks
          .filter((task) => task.status === "OPEN")
          .map((task) => (
            <TaskCard
              key={task.id}
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
              key={task.id}
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
              key={task.id}
              title={task.title}
              description={task.description}
            />
          ))}
      </div>
    </div>
  );
};
