import { type FC } from "react";
import { ProgressBar } from "../../../shared/ui/ProgressBar/ProgressBar";
interface ProjectCardsProps {
  onSelectProject: (projectId: number) => void;
  project: {
    id: number;
    name: string;
    description: string;
  };
}

export const ProjectStatusTag = () => {
  return (
    <span className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-semibold">
      Active
    </span>
  );
};

export const ProjectCards: FC<ProjectCardsProps> = ({
  project,
  onSelectProject,
}) => {
  return (
    <div
      onClick={() => onSelectProject(project.id)}
      className="border border-surface selection: boder-[1.5px] hover:border-secondary rounded-[12px] p-[16px] cursor-pointer"
    >
      <div className="flex flex-row justify-between align-top mb-[10px]">
        <div className="min-h-[30px]">
          <div className="font-bold text-[14px]">{project.name}</div>
          <div className="text-[10px] font-">
            A simple app to manage your tasks
          </div>
        </div>
        <div>
          <ProjectStatusTag />
        </div>
      </div>
      <div className="text-[12px] line-clamp-2 min-h-[50px] ">
        {project.description}
      </div>
      <div className="flex flex-row justify-between text-[12px]">
        <div>
          <div>Progress</div>
        </div>
        <div className="flex flex-row">
          <div>{24} tasks.</div>
          <div>18 done</div>
          <div>100%</div>
        </div>
      </div>
      <ProgressBar />
    </div>
  );
};
