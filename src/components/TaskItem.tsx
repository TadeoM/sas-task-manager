import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import SubjectIcon from '@mui/icons-material/SubjectOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { alpha, styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { useState, type KeyboardEvent } from 'react';
import type { Status, Task } from '../data/tasksRepository';
import { TaskDetailsModal } from './TaskDetailsModal';
import AccessTime from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { formatToMonthDate, isOverdue } from '../lib/dates';

// Vermillion, not pure red — part of the Okabe-Ito colorblind-safe palette,
// stays distinguishable for protanopia/deuteranopia in a way pure red doesn't.
const OVERDUE_COLOR = '#D55E00';

export interface TaskItemActions {
  onSetTitle: (id: string, title: string) => void;
  onSetDescription: (id: string, description: string) => void;
  onSetDueDate: (id: string, dueDate: string) => void;
  onSetStatus: (id: string, status: Status) => void;
  onShift: (id: string, direction: 1 | -1) => void;
  onRemove: (id: string) => void;
}

interface TaskItemProps {
  task: Task;
  actions: TaskItemActions;
}

export const TaskItem = ({ task, actions }: TaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    const typingInTitle =
      e.target instanceof HTMLInputElement && e.target.type === 'text';
    if (typingInTitle || !e.ctrlKey) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      actions.onShift(task.id, 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      actions.onShift(task.id, -1);
    }
  };

  return (
    <ListItem
      ref={setNodeRef}
      onKeyDown={handleKeyDown}
      disablePadding
      disableGutters
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Paper variant="outlined" sx={{ width: '100%', p: 0.5 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            aria-label={`Reorder ${task.title}`}
            sx={{ touchAction: 'none' }}
            {...attributes}
            {...listeners}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
          <TaskButton sx={{color: 'inherit'}} onClick={() => setIsOpen(true)}>
            {task.title}
          </TaskButton>
          <IconButton
            size="small"
            aria-label={`Delete ${task.title}`}
            onClick={() => actions.onRemove(task.id)}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>

        {(task.dueDate || task.description) && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', pl: 5, pt: 0.5 }}
          >
            {task.dueDate &&
              (() => {
                const overdue = isOverdue(task.dueDate);
                return (
                  <Chip
                    size="small"
                    sx={{
                      padding: '15px 10px',
                      ...(overdue && {
                        bgcolor: alpha(OVERDUE_COLOR, 0.15),
                        color: OVERDUE_COLOR,
                        fontWeight: 'bold',
                        '& .MuiChip-icon': { color: OVERDUE_COLOR },
                      }),
                    }}
                    icon={
                      overdue ? (
                        <WarningAmberIcon fontSize="small" />
                      ) : (
                        <AccessTime fontSize="small" />
                      )
                    }
                    label={`${overdue ? 'Overdue' : 'Due'} ${formatToMonthDate(task.dueDate)}`}
                  />
                );
              })()}
            {task.description && (
              <Tooltip title={task.description}>
                <SubjectIcon
                  fontSize="small"
                  color="action"
                  titleAccess="Has a description"
                />
              </Tooltip>
            )}
          </Stack>
        )}
      </Paper>
      <TaskDetailsModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        task={task}
        actions={actions}
      />
    </ListItem>
  );
};

export const TaskButton = styled(Button)({
  flex: 1,
  textTransform: 'none',
  justifyContent: 'flex-start',
  '&:hover': {
    textDecoration: 'underline',
  },
});
