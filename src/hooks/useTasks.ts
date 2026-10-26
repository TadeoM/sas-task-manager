import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import {
  getTasks,
  saveTasks,
  STATUS_ORDER,
  type Status,
  type Task,
} from '../data/tasksRepository';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => getTasks());

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (title: string, status: Status) => {
    setTasks((prev) => {
      // ids are just incrementing numbers, take the highest and add one
      const nextId =
        prev.reduce((max, task) => Math.max(max, Number(task.id) || 0), 0) + 1;
      return [...prev, { id: String(nextId), title, status }];
    });
  };

  const setTitle = (id: string, title: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title } : task)),
    );
  };

  const setDescription = (id: string, description: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, description } : task)),
    );
  };

  const setDueDate = (id: string, dueDate: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, dueDate } : task)),
    );
  };

  const setStatus = (id: string, status: Status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task)),
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const shiftTask = (id: string, direction: 1 | -1) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const currentIndex = STATUS_ORDER.indexOf(task.status);
        const nextIndex = Math.min(
          Math.max(currentIndex + direction, 0),
          STATUS_ORDER.length - 1,
        );
        return { ...task, status: STATUS_ORDER[nextIndex] };
      }),
    );
  };

  const reorderTask = (
    activeId: string,
    overId: string | null,
    status: Status,
  ) => {
    setTasks((prev) => {
      const activeIndex = prev.findIndex((task) => task.id === activeId);
      if (activeIndex === -1) return prev;

      const next = prev.map((task) =>
        task.id === activeId ? { ...task, status } : task,
      );
      const overIndex = overId
        ? next.findIndex((task) => task.id === overId)
        : next.length - 1;
      if (overIndex === -1) return next;

      return arrayMove(next, activeIndex, overIndex);
    });
  };

  return {
    tasks,
    addTask,
    setTitle,
    setDescription,
    setDueDate,
    setStatus,
    removeTask,
    shiftTask,
    reorderTask,
  };
};
