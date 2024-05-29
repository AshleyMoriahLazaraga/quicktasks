  import React, { useState } from 'react';
  import supabase from '../supabaseClient';
  import { UserContext } from '../contexts/UserContext';
  import Box from '@mui/material/Box';
  import TextField from '@mui/material/TextField';
  import Button from '@mui/material/Button';
  import Dialog from '@mui/material/Dialog';
  import DialogActions from '@mui/material/DialogActions';
  import DialogContent from '@mui/material/DialogContent';
  import DialogTitle from '@mui/material/DialogTitle';

  function TaskForm({ onAddTask, user_id, selectedCategory, toggleAddTaskSidebar }) {
    // static contextType = UserContext;
    const [taskData, setTaskData] = useState({
      title: '',
      description: '',
      dueDate: '',
    });
    const [open, setOpen] = React.useState(true);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setTaskData({ ...taskData, [name]: value });
    };

    const exit = (e) => {
      toggleAddTaskSidebar();
    }

    const handleSubmit = async (e) => { 
      e.preventDefault();
      const { title, description, dueDate } = taskData;

      if (title.trim() && dueDate.trim()) {
        try {
          // Call the onAddTask function to save the task to the Supabase database
          await onAddTask(title, description, dueDate, user_id, selectedCategory);
          
          const { data: categoryData, error: categoryError } = await supabase
            .from('category')
            .select('category_id')
            .eq('category_name', selectedCategory)
            .eq('user_id', user_id)
            .single();

          if (categoryError) {
            console.error('Error fetching category:', categoryError.message);
          }

          let categoryid = categoryData?.category_id;

          await supabase.from('task').insert([
            { 
              user_id: user_id,  // Include user_id
              category_id: categoryid,  // Include category_id
              title: title, 
              description: description, 
              // dueDate: dueDate,
              dueDate: new Date(dueDate),
            },
          ]);

          // Clear form fields after task is successfully added
          setTaskData({ title: '', description: '', dueDate: '' });
          toggleAddTaskSidebar();
          
        } catch (error) {
          console.error('Error adding task:', error.message);
        }
      } else {
        alert('Please enter a title and due date for the task.');
      }
    };
    
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = (event: React.SyntheticEvent<unknown>, reason?: string) => {
      if (reason !== 'backdropClick') {
        setOpen(false);
        toggleAddTaskSidebar();
      }
    };

    return (
      <div>
      {/* <Button onClick={handleClickOpen}>Open select dialog</Button> */}
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Fill the form</DialogTitle>
        <DialogContent>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '60ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >        
        <TextField
          id="title"
          label="Title"
          variant="outlined"
          name="title"
          value={taskData.title}
          onChange={handleChange} 
          required
        /><br></br>
        <TextField
          id="description"
          label="Description"
          variant="outlined"
          name="description"
          value={taskData.description}
          onChange={handleChange}
          multiline
          rows={4}
        /><br></br>
        <TextField
          id="dueDate"
          label="Due Date"
          variant="outlined"
          type="date"
          name="dueDate"
          value={taskData.dueDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
        /><br></br>
        {/* <button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </button><br></br>
        <button onClick={exit}>Exit</button> */}
      </Box>
      </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Ok</Button>
        </DialogActions>
      </Dialog>
      </div>
    );
  }

  export default TaskForm;
