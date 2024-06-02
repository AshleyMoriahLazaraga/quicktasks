import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import '../CSS files/SideBar.css';

function NavigationList() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  }

  return (
    <List>
      {['Logout'].map((text, index) => (
        <ListItem key={text} disablePadding onClick={() => handleLogout()}>
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
              <LogoutIcon className="icon" />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default NavigationList;
