import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { Task } from '../data/tasksRepository';

interface TaskDragPreviewProps {
  task: Task;
}

// used to show dragging while outside of task list
export const TaskDragPreview = ({ task }: TaskDragPreviewProps) => {
  return (
    <Paper
      elevation={4}
      sx={{
        width: 300,
        p: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        cursor: 'grabbing',
      }}
    >
      <DragIndicatorIcon fontSize="small" />
      <Typography noWrap sx={{ flex: 1 }}>
        {task.title}
      </Typography>
    </Paper>
  );
};
