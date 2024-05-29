import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

export default function TaskList({ selectedCategory, tasks }: { selectedCategory: string, tasks: any[] }) {
  const [checked, setChecked] = React.useState([]);
  const [sortedTasks, setSortedTasks] = React.useState(tasks);

  React.useEffect(() => {
    setSortedTasks(tasks);
  }, [tasks]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const sortTasksByDeadline = () => {
    const sorted = [...sortedTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    setSortedTasks(sorted);
  };

  return (
    <div style={{ marginLeft: '260px', height: '600px', overflowY: 'auto' }}>
      <button onClick={sortTasksByDeadline}>Sort by Closest Deadlines</button>
      <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {sortedTasks.map((task, index) => {
          const labelId = `checkbox-list-secondary-label-${task.task_id}`;
          return (
            <ListItem
              key={task.task_id}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={handleToggle(task.task_id)}
                  checked={checked.indexOf(task.task_id) !== -1}
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
// import * as React from 'react';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Checkbox from '@mui/material/Checkbox';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// //import { format } from 'date-fns';
// import supabase from '../supabaseClient'; // Adjust the import path as needed

// interface Task {
//   task_id: number;
//   title: string;
//   description: string;
//   dueDate: string;
//   completed: boolean;
// }

// interface TaskListProps {
//   selectedCategory: string;
//   tasks: Task[];
//   setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // Add this to update tasks
// }

// export default function TaskList({ selectedCategory, tasks, setTasks }: TaskListProps) {
//   const handleToggle = async (taskId: number, currentStatus: boolean) => {
//     try {
//       const { error } = await supabase
//         .from('task')
//         .update({ completed: !currentStatus })
//         .eq('task_id', taskId);

//       if (error) {
//         console.error('Error updating task:', error.message);
//       } else {
//         // Update the local state to reflect the change
//         setTasks((prevTasks) =>
//           prevTasks.map((task) =>
//             task.task_id === taskId ? { ...task, completed: !currentStatus } : task
//           )
//         );
//       }
//     } catch (error) {
//       console.error('Error updating task:', error.message);
//     }
//   };

//   const handleSortByDeadline = () => {
//     const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
//     // This will just update the state of checked tasks to reflect sorted order, in a real scenario you may want to set sorted tasks to state and render them accordingly.
//     setTasks(sortedTasks);
//   };

//   return (
//     <div style={{ marginLeft: '200px', overflowY: 'auto', maxHeight: '400px' }}>
//       <Button onClick={handleSortByDeadline} variant="contained" color="primary">Sort by Closest Deadline</Button>
//       <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
//         {tasks.map((task) => {
//           const labelId = `checkbox-list-secondary-label-${task.task_id}`;
//           return (
//             <ListItem
//               key={task.task_id}
//               secondaryAction={
//                 <Checkbox
//                   edge="end"
//                   onChange={() => handleToggle(task.task_id, task.completed)}
//                   checked={task.completed}
//                   inputProps={{ 'aria-labelledby': labelId }}
//                 />
//               }
//               disablePadding
//             >
//               <ListItemButton>
//                 <ListItemAvatar>
//                   <Avatar sx={{ bgcolor: 'transparent' }}>{String.fromCodePoint(0x1F60A)}</Avatar>
//                 </ListItemAvatar>
//                 <ListItemText 
//                   id={labelId} 
//                   primary={task.title} 
//                   secondary={`${task.description} - Due: ${format(new Date(task.dueDate), 'dd MMM yyyy')}`} 
//                 />
//               </ListItemButton>
//             </ListItem>
//           );
//         })}
//       </List>
//     </div>
//   );
// }
