import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import supabase from '../supabaseClient';

interface Task {
  task_id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
}

interface TaskListProps {}

const TaskList: React.FC<TaskListProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useUser();
  const { category_id } = useParams();

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('task')
          .select('*')
          .eq('user_id', user.user_id)
          .eq('category_id', category_id);

        if (error) {
          console.error('Error fetching tasks:', error);
        } else {
          setTasks(data || []);
        }
      }
    };

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
        width: '100%',
      }}
    >
      <List sx={{ width: '100%', height: '100%' }}>
        {tasks.map((task) => (
          <ListItem key={task.task_id} sx={{ border: '1px solid #ccc', borderRadius: '10px', marginBottom: 1, marginLeft:'0px', paddingLeft: '0px', justifyContent: 'space-evenly',
           }} disablePadding>
            <ListItemButton onClick={() => handleTaskCompletionToggle(task)}>
              <ListItemIcon sx={{ color: '#B8DBD9', minWidth: 'auto' }}>
                {task.completed ? <CheckBox /> : <CheckBoxOutlineBlank />}
              </ListItemIcon>
            </ListItemButton>
            <ListItemText
              primary={
                <Typography variant="h6" component="div" sx={{ textAlign: 'left' }}>
                  {task.title}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="#B8DBD9" sx={{ textAlign: 'left' }}>
                  {task.description}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TaskList;
