import React, { useState } from 'react';
import { Fab } from "@mui/material";
import { MdAdd } from "react-icons/md";
import AddTaskDialog from './AddTaskDialog';
import '../CSS files/AddButton.css';

interface AddTaskButtonProps {
  onTaskAdded: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onTaskAdded }) => {
  const [openTaskDialog, setOpenTaskDialog] = useState(false);

  const handleDialogOpen = () => {
    setOpenTaskDialog(true);
  };

  const handleTaskDialogClose = () => {
    setOpenTaskDialog(false);
    onTaskAdded(); // Call the callback after the task dialog is closed
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
      <AddTaskDialog
        open={openTaskDialog}
        onClose={handleTaskDialogClose}
      />
    </div>
  );
}

export default AddTaskButton;
