interface TaskCardProps {
  title: string;
  description: string;
  onSelectTask: (taskId: string) => void;
  id: string;
}

export const TaskCard = ({
  title,
  description,
  onSelectTask,
  id,
}: TaskCardProps) => {
  return (
    <div
      className="border border-secondary rounded-md p-4 mb-4"
      onClick={() => onSelectTask(id)}
    >
      <div className="text-[12px] text-[grey]">Title:</div>
      <div className="mb-[15px]">{title}</div>
      <div className="text-[12px] text-[grey]">Description:</div>
      <div className="mb-[15px]">{description}</div>
    </div>
  );
};
