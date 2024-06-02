import React, { useState } from 'react';
import { Button } from "@mui/material";
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
