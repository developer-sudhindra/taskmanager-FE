import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  swimlaneLabel: string;
  children: React.ReactNode;
}

export const KanbanColumn = ({
  swimlaneLabel,
  children,
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: swimlaneLabel,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[70vh] rounded-xl p-4 border transition-colors duration-200 flex flex-col ${
        isOver
          ? "bg-surface border-dashed border-2 border-blue-500/50 shadow-inner"
          : "bg-surface border-border shadow-sm"
      }`}
    >
      <div className="font-bold mb-4 text-text text-center border-b border-border pb-2 tracking-wide text-sm uppercase">
        {swimlaneLabel}
      </div>

      <div className="flex-1 overflow-y-auto max-h-[65vh] pr-1 space-y-1">
        {children}
      </div>
    </div>
  );
};
