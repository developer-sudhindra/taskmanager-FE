import { useState } from "react"; // 1. Import useState
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { skipToken } from "@reduxjs/toolkit/query/react";

import { TaskCard } from "../TaskCard/TaskCard";
import { KanbanColumn } from "./KanbanColumn";
import {
  useGetAllTasksQuery,
  useUpdateTaskMutation,
  usePrefetch,
} from "../../../features/tasks/tasksApi";

export const Tasks = ({
  projectId,
  swimlanes,
}: {
  projectId: string;
  swimlanes: string[];
}) => {
  const navigate = useNavigate();

  // 4. Local state tracks the active object instance while moving across columns
  const [activeTask, setActiveTask] = useState<any | null>(null);

  const {
    data: response,
    isLoading,
    error,
  } = useGetAllTasksQuery(projectId ?? skipToken);
  const [updateTask] = useUpdateTaskMutation();
  const prefetchTaskDetails = usePrefetch("getOneTask");

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
  );

  // 5. Catch when a drag starts to populate our floating overlay target state
  const handleDragStart = (event: DragStartEvent) => {
    const task = response?.data?.find((t: any) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null); // 🚨 Clear active selection state instantly on drop

    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const targetStatus = over.id as string;

    const draggedTask = response?.data?.find((task: any) => task.id === taskId);
    if (!draggedTask) return;

    if (draggedTask.status !== targetStatus) {
      try {
        await updateTask({
          taskId,
          payload: { status: targetStatus },
        }).unwrap();
      } catch (err) {
        console.error(
          "Failed to commit task status modification transition:",
          err,
        );
      }
    }
  };

  if (isLoading)
    return (
      <div className="p-6 text-center text-muted animate-pulse">Loading...</div>
    );
  if (error)
    return (
      <div className="p-6 text-center text-red-400">Failed to load data.</div>
    );

  const gridColsClass =
    swimlanes.length === 4
      ? "grid-cols-1 md:grid-cols-4"
      : swimlanes.length === 5
        ? "grid-cols-1 md:grid-cols-5"
        : "grid-cols-1 md:grid-cols-3";

  return (
    // Added onDragStart hook to your main tracking context parameters block
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`grid ${gridColsClass} gap-6 w-full p-2`}>
        {swimlanes.map((swimlaneLabel: string) => {
          const columnTasks =
            response?.data?.filter(
              (task: any) => task.status === swimlaneLabel,
            ) || [];

          return (
            <KanbanColumn key={swimlaneLabel} swimlaneLabel={swimlaneLabel}>
              {columnTasks.length === 0 ? (
                <div className="text-center text-xs text-muted/30 py-12 border-2 border-dashed border-border/40 rounded-xl select-none bg-bg/20">
                  Empty Column
                </div>
              ) : (
                columnTasks.map((task: any) => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    onSelectTask={(id) =>
                      navigate(`/projects/${projectId}/tasks/${id}`)
                    }
                    onMouseEnter={() =>
                      prefetchTaskDetails(task.id, { force: false })
                    }
                  />
                ))
              )}
            </KanbanColumn>
          );
        })}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="w-[280px] md:w-full max-w-[340px] rotate-2 shadow-2xl z-[9999] pointer-events-none">
            <TaskCard
              id={activeTask.id}
              title={activeTask.title}
              description={activeTask.description}
              onSelectTask={() => {}}
              onMouseEnter={() => {}}
              isOverlayPreview
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
