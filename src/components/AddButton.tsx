import React, { useState } from 'react';
import { Fab, Dialog, List, ListItemText, ListItemButton } from "@mui/material";
import { MdAdd } from "react-icons/md";
import AddTaskDialog from './AddTaskDialog';
import AddCategoryDialog from './AddCategoryDialog'; // Import AddCategoryDialog
import '../CSS files/AddButton.css';

interface AddButtonProps {
  onTaskAdded: () => void; // callback to trigger after task is added
}

const AddButton: React.FC<AddButtonProps> = ({ onTaskAdded }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false); // State for AddCategoryDialog

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleTaskDialogOpen = () => {
    setOpenTaskDialog(true);
    setOpenDialog(false);
  };

  const handleCategoryDialogOpen = () => {
    setOpenCategoryDialog(true); // Open AddCategoryDialog
    setOpenDialog(false); // Close main dialog
  };

  const handleTaskDialogClose = () => {
    setOpenTaskDialog(false);
    onTaskAdded(); // Call the callback after the task dialog is closed
  };

  const handleCategoryDialogClose = () => {
    setOpenCategoryDialog(false); // Close AddCategoryDialog
  };

  return (
    <div className="floating-button-container">
      <Fab
        aria-label="add"
        className="floating-button"
        sx={{
          color: '#B8DBD9',
          width: '56px',
          height: '56px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
        }}
        onClick={handleDialogOpen}
      >
        <MdAdd style={{ fontSize: '32px', color: '#202124' }}/>
      </Fab>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="dialog-title"
      >
        <List>
          <ListItemButton onClick={handleTaskDialogOpen}>
            <ListItemText primary="Task" />
          </ListItemButton>
          <ListItemButton onClick={handleCategoryDialogOpen}> {/* Trigger AddCategoryDialog */}
            <ListItemText primary="Category" />
          </ListItemButton>
        </List>
      </Dialog>
      <AddTaskDialog
        open={openTaskDialog}
        onClose={handleTaskDialogClose}
      />
      <AddCategoryDialog 
        open={openCategoryDialog}
        onClose={handleCategoryDialogClose}
      />
    </div>
  );
}

export default AddButton;
