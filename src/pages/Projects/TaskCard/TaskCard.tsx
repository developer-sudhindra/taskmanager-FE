import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  onSelectTask: (taskId: string) => void;
  onMouseEnter: () => void;
  isOverlayPreview?: boolean;
}

export const TaskCard = ({
  title,
  description,
  onSelectTask,
  id,
  onMouseEnter,
  isOverlayPreview = false,
}: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      disabled: isOverlayPreview,
    });

  const style = {
    transform: isOverlayPreview ? undefined : CSS.Transform.toString(transform),
    opacity: isDragging ? 0.2 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isOverlayPreview ? {} : attributes)}
      {...(isOverlayPreview ? {} : listeners)}
      onMouseEnter={onMouseEnter}
      onClick={() => !isDragging && onSelectTask(id)}
      className={`bg-surface border border-border rounded-xl p-4 mb-4 w-full shadow-sm text-left transition-shadow duration-150 group select-none ${
        isOverlayPreview
          ? "cursor-grabbing border-blue-500 shadow-2xl scale-105 z-[9999]"
          : "cursor-grab active:cursor-grabbing hover:border-slate-300 dark:hover:border-slate-600"
      }`}
    >
      <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
        Title
      </div>
      <div className="text-text font-semibold mb-3 truncate">{title}</div>

      <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
        Description
      </div>
      <div className="text-muted text-sm line-clamp-2">
        {description || "No description provided."}
      </div>
    </div>
  );
};
