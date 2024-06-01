import { Box, Typography } from "@mui/material";
import TaskList from "./TaskList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from '../contexts/UserContext';
import supabase from '../supabaseClient';

function CategoryPage() {
  const { user } = useUser();
  const { category_id } = useParams();
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        if (user) {
          const { data, error } = await supabase
            .from('category')
            .select('category_name')
            .eq('category_id', category_id)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            setCategoryName(data.category_name);
          }
        }
      } catch (error) {
        console.error('Error fetching category name:', error.message);
      }
    };

    fetchCategoryName();
  }, [user, category_id]);

  return(
    <Box sx={{ flexGrow: 3, overflow: 'auto', width: '80vw', marginBottom: '100px' }}>
      <Typography variant="h2">{categoryName} Tasks</Typography>
      <TaskList />
    </Box>
  );
}

export default CategoryPage;
