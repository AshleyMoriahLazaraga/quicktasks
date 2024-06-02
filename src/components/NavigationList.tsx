import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { IoSettingsOutline } from "react-icons/io5";
import { MdTaskAlt } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../CSS files/SideBar.css';

function NavigationList() {
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    switch(page) {
      case 'Tasks':
        navigate('/home/tasks');
        break;
      case 'Logout':
        navigate('/login');
        break;
      default:
        break;
    }
  };

  return (
    <List>
      {['Tasks', 'Logout'].map((text, index) => (
        <ListItem key={text} disablePadding onClick={() => handleNavigation(text)}>
          <ListItemButton sx={{
            color: '#B8DBD9',
            '& .icon': {
              color: '#B8DBD9',
            },
            '&:hover': {
              backgroundColor: '#B8DBD9',
              color: '#202124',
              '& .icon': {
                color: '#202124',
              },
            }
          }}>
            <ListItemIcon sx={{ '&:hover': { backgroundColor: '#B8DBD9' } }}>
              {index === 0 ? <MdTaskAlt className="icon" /> : <IoSettingsOutline className="icon" />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default NavigationList;
