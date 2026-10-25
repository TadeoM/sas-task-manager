import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { STATUS_ORDER, type Status, type Task } from '../data/tasksRepository';
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskButton, type TaskItemActions } from './TaskItem';

const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

const ResponsiveDialog = styled(Dialog)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    '& .MuiDialog-paper': {
      margin: theme.spacing(2),
      width: `calc(100% - ${theme.spacing(4)})`,
      height: `fit-content`,
      maxHeight: `calc(100% - ${theme.spacing(4)})`,
      borderRadius: theme.shape.borderRadius,
    },
  },
  [theme.breakpoints.up('sm')]: {
    '& .MuiDialog-paper': {
      height: 'fit-content',
      maxHeight: '90vh',
    },
  },
}));

interface TaskDraft {
  title: string;
  description: string;
  dueDate: string;
  status: Status;
}

const toDraft = (task: Task): TaskDraft => ({
  title: task.title,
  description: task.description ?? '',
  dueDate: task.dueDate ?? '',
  status: task.status,
});

interface TaskDetailsModalProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  actions: TaskItemActions;
}

export const TaskDetailsModal = ({
  task,
  open,
  onClose,
  actions,
}: TaskDetailsModalProps) => {
  const [draft, setDraft] = useState<TaskDraft>(() => toDraft(task));

  useEffect(() => {
    if (open) setDraft(toDraft(task));
  }, [open, task]);

  const handleSave = () => {
    actions.onSetTitle(task.id, draft.title);
    actions.onSetDescription(task.id, draft.description);
    actions.onSetDueDate(task.id, draft.dueDate);
    actions.onSetStatus(task.id, draft.status);
    onClose();
  };

  const handleDelete = () => {
    actions.onRemove(task.id);
    onClose();
  };

  return (
    <ResponsiveDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ paddingBottom: '5px' }}>Edit Card</DialogTitle>
      <DialogTitle sx={{ fontSize: 'small', color:'lightgrey', paddingTop:'0' }}>In list {task.status}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1.5 }}>
          <TextField
            label="Title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="Description"
            multiline
            minRows={4}
            value={draft.description}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
            fullWidth
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Due Date"
              type="date"
              value={draft.dueDate}
              onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="Status"
              select
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as Status })
              }
              fullWidth
            >
              {STATUS_ORDER.map((status) => (
                <MenuItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <TaskButton
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          sx={{ flex: '0 0 auto' }}
        >
          Delete
        </TaskButton>
        <Stack direction="row" spacing={1}>
          <TaskButton onClick={onClose}>Cancel</TaskButton>
          <TaskButton variant="contained" onClick={handleSave}>
            Save
          </TaskButton>
        </Stack>
      </DialogActions>
    </ResponsiveDialog>
  );
};
