import MoreVertIcon from '@mui/icons-material/MoreVert';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
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

const CategoryList = forwardRef<{ fetchCategories: () => void }, CategoryListProps>(({ onCategoryUpdated, setLoading }, ref) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useUser();
  // const {categoryId} = useParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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


  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof SVGElement && event.target.closest('.icon')) {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        setCategories(categories.filter(category => category.category_id !== categoryId));
      }
    } catch (error) {
      console.error('Error deleting category:', error.message);
    }
  };

  return (
    <List>
      {categories.map((category) => (
        <ListItem key={category.category_id} disablePadding className={'list-item-button-open'}
        onClick={() => handleNavigation(category.category_id)}>
          <ListItemButton sx={{
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
          }} onClick={handleClick}>
            <ListItemText primary={category.category_name} className={'list-item-text-open'}
              style={{ marginRight: '100px' }} />
            <ListItemIcon style={{ paddingRight: '0px', marginRight: '0px', minWidth: 'auto' }}>
              <MoreVertIcon className='icon'/>
            </ListItemIcon>
          </ListItemButton>
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
            <MenuItem onClick={handleClose}>Edit Category</MenuItem>
            <MenuItem onClick={() => {
              deleteCategory(category.category_id);
              handleClose();
            }}>Delete Category</MenuItem>
          </Menu>
        </ListItem>
      ))}
    </List>
  );
});

export default CategoryList;