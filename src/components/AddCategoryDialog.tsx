import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useUser } from '../contexts/UserContext'; // Import useUser hook
import supabase from '../supabaseClient';

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({ open, onClose }) => {
  const [categoryName, setCategoryName] = useState('');
  const { user } = useUser();

  const handleAddCategory = async () => {
    if (!categoryName) {
      alert('Category name cannot be empty');
      return;
    }

    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const { data, error } = await supabase.from('category').insert([
      {
        category_name: categoryName,
        user_id: user.user_id,
      },
    ]);

    if (error) {
      console.error('Error adding category:', error);
    } else {
      setCategoryName('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Category Name"
          type="text"
          fullWidth
          variant="outlined"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddCategory} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryDialog;
