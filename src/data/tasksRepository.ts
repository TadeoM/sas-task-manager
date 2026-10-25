import { readFromStorage, writeToStorage } from '../lib/localStorageDb';
import seedTasks from './tasks.seed.json';

export type Status = 'todo' | 'inprogress' | 'done';

export const STATUS_ORDER: Status[] = ['todo', 'inprogress', 'done'];

export interface Task {
  id: string;
  title: string;
  status: Status;
  description?: string;
  dueDate?: string;
}

const STORAGE_KEY = 'sas-task-manager:tasks';

const isValidStatus = (value: unknown): value is Status =>
  value === 'todo' || value === 'inprogress' || value === 'done';

const isTask = (value: unknown): value is Task => {
  if (typeof value !== 'object' || value === null) return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    isValidStatus(task.status)
  );
};

const validTasks = (value: unknown): Task[] =>
  Array.isArray(value) ? value.filter(isTask) : [];

export const getTasks = (): Task[] =>
  validTasks(readFromStorage<unknown>(STORAGE_KEY, seedTasks));

export const saveTasks = (tasks: Task[]): void =>
  writeToStorage(STORAGE_KEY, tasks);
