import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import supabase from '../supabaseClient';

export default function TaskList({ selectedCategory, tasks, setTasks }: { selectedCategory: string, tasks: any[], setTasks: (tasks: any[]) => void }) {
  const [checked, setChecked] = React.useState<number[]>([]);
  const [sortedTasks, setSortedTasks] = React.useState(tasks);

  React.useEffect(() => {
    setSortedTasks(tasks);
  }, [tasks]);

  const handleToggle = async (task) => {
    const currentIndex = checked.indexOf(task.task_id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(task.task_id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

    // Update the task completion status in the database
    const { error } = await supabase
      .from('task')
      .update({ completed: !task.completed })
      .eq('task_id', task.task_id);

    if (error) {
      console.error('Error updating task:', error.message);
    } else {
      // Update the task list state to reflect the change
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.task_id === task.task_id ? { ...t, completed: !task.completed } : t
        )
      );
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // React.useEffect(() => {
  //   // Sort the tasks so that completed tasks are at the bottom
  //   const sorted = [...tasks].sort((a, b) => {
  //     if (a.completed === b.completed) {
  //       return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  //     }
  //     return a.completed ? 1 : -1;
  //   });
  //   setSortedTasks(sorted);
  // }, [tasks]);

  const sortTasksByDeadline = () => {
    const sorted = [...sortedTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    setSortedTasks(sorted);
  };

  return (
    <div style={{ marginLeft: '260px', height: '600px', overflowY: 'auto' }}>
      <button onClick={sortTasksByDeadline} variant="contained" color="primary">Sort by Closest Deadlines</button>
      <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {sortedTasks.map((task, index) => {
          const labelId = `checkbox-list-secondary-label-${task.task_id}`;
          return (
            <ListItem
              key={task.task_id}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={() => handleToggle(task)}
                  checked={task.completed}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                    }}
                  >
                    {index % 2 === 0 ? '✅' : '📝'} {/* Example emojis */}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  id={labelId}
                  primary={task.title}
                  secondary={`${task.description} - ${formatDate(task.dueDate)}`}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
