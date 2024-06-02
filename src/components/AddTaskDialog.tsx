import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; // Import useUser hook
import supabase from '../supabaseClient';

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, onClose }) => {
  const { category_id } = useParams<{ category_id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { user } = useUser(); // Use useUser hook to get authenticated user

  const handleAddTask = async () => {
    if (!title) {
      alert('Title cannot be empty');
      return;
    }

    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const { data, error } = await supabase.from('task').insert([
      {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
         category_id,
        user_id: user.user_id,
        completed: false,
      },
    ]);

    if (error) {
      console.error('Error adding task:', error);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Due Date"
          type="date"
          fullWidth
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddTask} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskDialog;
