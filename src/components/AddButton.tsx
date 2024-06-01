import React, { useState } from 'react';
import { Fab, Dialog, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import { MdAdd } from "react-icons/md";
import '../CSS files/AddButton.css';

function AddButton() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
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
          <ListItemButton>
            <ListItemText primary="Task" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Category" />
          </ListItemButton>
        </List>
      </Dialog>
    </div>
  );
}

export default AddButton;
