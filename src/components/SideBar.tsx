import { Box, Divider, Drawer, List, Toolbar, Typography } from '@mui/material';
import '../CSS files/SideBar.css';
import { useUser } from '../contexts/UserContext';
import logoDark from '../images/logo_dark.png';
import CategoryList from './CategoryList';
import NavigationList from './NavigationList';
import { useRef, useState } from 'react';
import AddCategoryButton from './AddCategoryButton';

const drawerWidth = 240;

function SideBar() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const categoryListRef = useRef<{ fetchCategories: () => void }>(null);

  const handleCategoryUpdated = () => {
    if (categoryListRef.current) {
      categoryListRef.current.fetchCategories();
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#202124',
            color: '#fff',
            borderColor: '#fff',
            overflow: 'auto',
          },
        }}
      >
        <Toolbar>
          <Box className="logo-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <img src={logoDark} alt="Logo" className="logo" />
            <Typography sx={{ marginBottom: '20px', color: '#B8DBD9' }}>{user.email}</Typography>
          </Box>
        </Toolbar>
        <Divider className="divider" />
        <NavigationList />
        <Divider className="divider" sx={{marginBottom: '10px'}} />

        <AddCategoryButton onCategoryAdded={handleCategoryUpdated} />

        <Typography sx={{ marginBottom: '10px', marginTop: '10px', color: '#B8DBD9' }}> Categories </Typography>
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <CategoryList ref={categoryListRef} onCategoryUpdated={() => setLoading(false)} setLoading={setLoading}/>
        </Box>
      </Drawer>
    </Box>
  );
}

export default SideBar;
