import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import supabase from '../supabaseClient';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface Task {
  task_id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
}

interface TaskListProps {
  onTasksUpdated?: () => void;
  setLoading: (loading: boolean) => void; // Pass setLoading function as prop
}

const TaskList = forwardRef<{ fetchTasks: () => void }, TaskListProps>(({ onTasksUpdated, setLoading }, ref) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useUser();
  const { category_id } = useParams();
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    if (user) {
      setLoading(true); // Set loading to true
      const { data, error } = await supabase
        .from('task')
        .select('*')
        .eq('user_id', user.user_id)
        .eq('category_id', category_id);

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data || []);
        if (onTasksUpdated) {
          onTasksUpdated();
        }
      }
      setLoading(false); // Set loading to false after tasks are fetched
    }
  };

  useImperativeHandle(ref, () => ({
    fetchTasks
  }));

  useEffect(() => {
    fetchTasks();
  }, [category_id, user]);

  const handleTaskCompletionToggle = async (task: Task) => {
    try {
      const updatedTasks = tasks.map(t => {
        if (t.task_id === task.task_id) {
          return { ...t, completed: !t.completed };
        } else {
          return t;
        }
      });
      setTasks(updatedTasks);

      await supabase
        .from('task')
        .update({ completed: !task.completed })
        .eq('task_id', task.task_id);
    } catch (error) {
      console.error('Error toggling task completion:', error.message);
    }
  };

  const handleClickOpen = (task: Task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedTask) {
      setSelectedTask({ ...selectedTask, [name]: value });
    }
  };

  const handleSaveChanges = async () => {
    if (selectedTask) {
      try {
        await supabase
          .from('task')
          .update({
            title: selectedTask.title,
            description: selectedTask.description,
            dueDate: selectedTask.dueDate,
          })
          .eq('task_id', selectedTask.task_id);

        setTasks(tasks.map(t => (t.task_id === selectedTask.task_id ? selectedTask : t)));
        handleClose();
      } catch (error) {
        console.error('Error updating task:', error.message);
      }
    }
  };

  const handleDeleteTask = async () => {
    if (selectedTask) {
      try {
        await supabase
          .from('task')
          .delete()
          .eq('task_id', selectedTask.task_id);

        setTasks(tasks.filter(t => t.task_id !== selectedTask.task_id));
        handleClose();
      } catch (error) {
        console.error('Error deleting task:', error.message);
      }
    }
  };
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'center',
        height: '80vh',
        flexGrow: 1,
        overflow: 'auto',
        marginTop: '50px',
        width: '80vw',
        padding: '9px'
      }}
    >
      <List sx={{ width: '100%', height: '100%' }}>
        {tasks.map((task) => (
          <ListItem
            key={task.task_id}
            sx={{ border: '1px solid #ccc', borderRadius: '10px', marginBottom: 1, paddingLeft: '0px', justifyContent: 'space-evenly', minHeight: "80px" }}
            disablePadding
          >
            <ListItemButton sx={{ color: '#B8DBD9', maxWidth: '40px' }} onClick={() => handleTaskCompletionToggle(task)} >
              <ListItemIcon sx={{ color: '#B8DBD9' }}>
                {task.completed ? <CheckBox /> : <CheckBoxOutlineBlank sx={{ width: '20px' }} />}
              </ListItemIcon>
            </ListItemButton>
            <ListItemButton onClick={() => handleClickOpen(task)} sx={{ flexGrow: 1 }}>
              <ListItemText
                primary={
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      textAlign: 'left',
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="#B8DBD9" sx={{ textAlign: 'left' }}>
                    {`${formatDate(task.dueDate)}`}
                    <br></br>
                    {`${task.description}`}
                    
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            name="title"
            value={selectedTask?.title || ''}
            onChange={handleTaskChange}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            name="description"
            value={selectedTask?.description || ''}
            onChange={handleTaskChange}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            variant="standard"
            name="dueDate"
            value={selectedTask?.dueDate ? new Date(selectedTask.dueDate).toISOString().substring(0, 10) : ''}
            onChange={handleTaskChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteTask} color="error">Delete</Button>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default TaskList;