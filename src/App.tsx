import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TaskBoard } from './components/TaskBoard';

const App = () => {
  return (
    <Box component="main" sx={{ minHeight: '100vh', p: 4 }}>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          SAS Task Manager
        </Typography>
        <TaskBoard />
      </Stack>
    </Box>
  );
};

export default App;
