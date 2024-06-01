import { Stack, Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import AddButton from "../components/AddButton";
import SideBar from "../components/SideBar";
import AllTasksPage from '../pages/AllTasksPage';
import SettingsPage from '../pages/SettingsPage';
import CategoryPage from '../components/CategoryPage';

function New() {
  return (
    <Stack direction="row" sx={{ height: '100vh' }}>
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="tasks" element={<AllTasksPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="category/:category_id" element={<CategoryPage />} />
        </Routes>
      </Box>
      <AddButton />
    </Stack>
  );
}

export default New;
