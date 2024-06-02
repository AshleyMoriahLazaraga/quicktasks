import { Button } from "@mui/material";
import React, { useState } from 'react';
import { MdAdd } from "react-icons/md";
import AddCategoryDialog from './AddCategoryDialog';

interface AddCategoryButtonProps {
  onCategoryAdded: () => void;
}

const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({ onCategoryAdded }) => {
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  const handleDialogOpen = () => {
    setOpenCategoryDialog(true);
  };

  const handleCategoryDialogClose = () => {
    setOpenCategoryDialog(false);
    onCategoryAdded(); // Call the callback after the category dialog is closed
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<MdAdd />}
        onClick={handleDialogOpen}
        disableElevation
        sx={{
          margin: '20px',
           backgroundColor: '#202124',
           color: '#B8DBD9',
          borderRadius: '10px',
          '&:hover': {
             backgroundColor: '#B8DBD9',
             color: '#202124',
          },
        }}
      >
        Add Category
      </Button>
      <AddCategoryDialog
        open={openCategoryDialog}
        onClose={handleCategoryDialogClose}
      />
    </>
  );
}

export default AddCategoryButton;
