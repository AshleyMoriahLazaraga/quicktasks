import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, TextField } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS files/CategoryList.css';
import { useUser } from '../contexts/UserContext';
import supabase from '../supabaseClient';

interface Category {
  category_id: string;
  category_name: string;
  user_id: string;
}

interface CategoryListProps {
  onCategoryUpdated?: () => void;
  setLoading: (loading: boolean) => void;
}

const CategoryList = forwardRef<{ fetchCategories: () => void }, CategoryListProps>(
  ({ onCategoryUpdated, setLoading }, ref) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { user } = useUser();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const navigate = useNavigate();

  const handleNavigation = (categoryId: string) => {
    navigate(`/home/category/${categoryId}`);
  }

  const fetchCategories = async () => {
    if (user) {
      setLoading(true);
      const { data, error } = await supabase
        .from('category')
        .select('category_id, category_name')
        .eq('user_id', user.user_id);

      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data || []);
        if(onCategoryUpdated) {
          onCategoryUpdated();
        }
      }
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () =>({
    fetchCategories
  }));

  useEffect(() => {
    fetchCategories();
  }, [user]);


  const handleMenuClick = (event: React.MouseEvent<SVGSVGElement>, category: Category) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentCategory(category);
  };

  const handleClose = () => {
    setAnchorEl(null);
    //setCurrentCategory(null);
  };

  const handleEditDialogOpen = () => {
    setNewCategoryName(currentCategory?.category_name || '');
    setEditDialogOpen(true);
    handleClose();
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleCategoryUpdate = async () => {
    if (currentCategory && newCategoryName.trim() !== '') {
      try {
        const { data, error } = await supabase
          .from('category')
          .update({ category_name: newCategoryName })
          .eq('category_id', currentCategory.category_id)
          .eq('user_id', user?.user_id);

        if (error) {
          console.error('Error updating category:', error);
        } else {
          setCategories(categories.map(category =>
            category.category_id === currentCategory.category_id ? { ...category, category_name: newCategoryName } : category
          ));
          setEditDialogOpen(false);
        }
      } catch (error) {
        console.error('Error updating category:', error.message);
      }
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('category')
        .delete()
        .eq('category_id', categoryId)
        .eq('user_id', user?.user_id);

      if (error) {
        console.error('Error deleting category:', error);
      } else {
        setCategories(categories.filter((category) => category.category_id !== categoryId));
      }
    } catch (error) {
      console.error('Error deleting category:', error.message);
    }
  };

  return (
    <>
      <List>
        {categories.map((category) => (
          <ListItem
            key={category.category_id}
            disablePadding
            className="list-item-button-open"
            onClick={() => handleNavigation(category.category_id)}
          >
            <ListItemButton
              sx={{
                '& .icon': {
                  color: '#B8DBD9',
                },
                '&:hover': {
                  backgroundColor: '#B8DBD9',
                  color: '#202124',
                  '& .icon': {
                    color: '#202124',
                  },
                },
                flexGrow: 1,
              }}
            >
              <ListItemText
                primary={category.category_name}
                className="list-item-text-open"
                style={{ marginRight: '100px' }}
              />
              <ListItemIcon
                style={{ paddingRight: '0px', marginRight: '0px', minWidth: 'auto' }}
                onClick={(event) => handleMenuClick(event, category)}
              >
                <MoreVertIcon className="icon" />
              </ListItemIcon>
            </ListItemButton>
            {currentCategory && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleEditDialogOpen}>Edit Category</MenuItem>
                <MenuItem
                  onClick={() => {
                    deleteCategory(currentCategory.category_id);
                    handleClose();
                  }}
                >
                  Delete Category
                </MenuItem>
              </Menu>
            )}
          </ListItem>
        ))}
      </List>

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the name of your category.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="standard"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleCategoryUpdate}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
);

export default CategoryList;