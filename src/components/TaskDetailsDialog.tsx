import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { MdEdit, MdDelete } from 'react-icons/md';

const TaskDetailsDialog = ({ task, onDelete, onEdit }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    onEdit(task);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(task);
    handleClose();
  };

  return (
    <>
      <ListItemButton onClick={handleOpen}>
        <ListItemText primary={task.title} secondary={task.description} />
      </ListItemButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{task.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{task.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEdit} startIcon={<MdEdit />} color="primary">
            Edit
          </Button>
          <Button onClick={handleDelete} startIcon={<MdDelete />} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskDetailsDialog;
