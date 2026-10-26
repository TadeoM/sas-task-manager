import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { STATUS_ORDER, type Status, type Task } from '../data/tasksRepository';
import { useTasks } from '../hooks/useTasks';
import { TaskDragPreview } from './TaskDragPreview';
import { TaskList, taskListDropId, type TaskListColor } from './TaskList';

const COLUMNS: { status: Status; label: string; color: TaskListColor }[] = [
  { status: 'todo', label: 'To Do', color: 'info' },
  { status: 'inprogress', label: 'In Progress', color: 'warning' },
  { status: 'done', label: 'Done', color: 'success' },
];

export const TaskBoard = () => {
  const {
    tasks,
    addTask,
    setTitle,
    setDescription,
    setDueDate,
    setStatus,
    shiftTask,
    removeTask,
    reorderTask,
  } = useTasks();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const itemActions = {
    onSetTitle: setTitle,
    onSetDescription: setDescription,
    onSetDueDate: setDueDate,
    onSetStatus: setStatus,
    onShift: shiftTask,
    onRemove: removeTask,
  };

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find((task) => task.id === String(active.id)) ?? null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // empty lists have no tasks to drop onto, so the list itself is the drop target
    const droppedOnEmptyColumn = STATUS_ORDER.find(
      (status) => taskListDropId(status) === overId,
    );
    if (droppedOnEmptyColumn) {
      reorderTask(activeId, null, droppedOnEmptyColumn);
      return;
    }

    const overTask = tasks.find((task) => task.id === overId);
    if (!overTask) return;
    reorderTask(activeId, overId, overTask.status);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 2,
          justifyItems: 'center',
          width: '100%',
          maxWidth: 1052,
        }}
      >
        {COLUMNS.map((column) => (
          <TaskList
            key={column.status}
            status={column.status}
            label={column.label}
            color={column.color}
            tasks={tasks.filter((task) => task.status === column.status)}
            onAdd={addTask}
            itemActions={itemActions}
          />
        ))}
      </Box>
      <DragOverlay>
        {activeTask && <TaskDragPreview task={activeTask} />}
      </DragOverlay>
    </DndContext>
  );
};
