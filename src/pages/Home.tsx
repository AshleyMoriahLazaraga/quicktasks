import { Box, Stack } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import '../CSS files/SideBar.css';
import CategoryPage from '../components/CategoryPage';
import SideBar from "../components/SideBar";

function Home() {
  return (
    <Stack direction="row" sx={{ height: '100vh' }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="category/:category_id" element={<CategoryPage />} />
        </Routes>
      </Box>
    </Stack>
  );
}

export default Home;
