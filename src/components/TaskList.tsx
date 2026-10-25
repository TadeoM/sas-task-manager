import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import type { Status, Task } from '../data/tasksRepository';
import { TaskItem, type TaskItemActions } from './TaskItem';

export type TaskListColor = 'info' | 'warning' | 'success';

export const taskListDropId = (status: Status) => `task-list-${status}`;

interface TaskListProps {
  status: Status;
  label: string;
  color: TaskListColor;
  tasks: Task[];
  onAdd: (title: string, status: Status) => void;
  itemActions: TaskItemActions;
}

export const TaskList = ({
  status,
  label,
  color,
  tasks,
  onAdd,
  itemActions,
}: TaskListProps) => {
  const [newTitle, setNewTitle] = useState('');
  const { setNodeRef } = useDroppable({ id: taskListDropId(status) });

  const addTypedTask = () => {
    const title = newTitle.trim();
    if (!title) return;
    onAdd(title, status);
    setNewTitle('');
  };

  return (
    <Paper
      ref={setNodeRef}
      component="section"
      aria-label={label}
      elevation={1}
      sx={{ padding: 2, width: '100%', maxWidth: 340 }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: `${color}.main`,
            }}
          />
          <Typography variant="h6" component="h2">
            {label}
          </Typography>
        </Stack>

        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <List
            disablePadding
            sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} actions={itemActions} />
            ))}
          </List>
        </SortableContext>

        <TextField
          size="small"
          placeholder="Add a task…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTypedTask()}
          onBlur={addTypedTask}
        />
      </Stack>
    </Paper>
  );
};
