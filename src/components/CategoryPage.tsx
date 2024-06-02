import { Box, Typography, CircularProgress } from "@mui/material";
import TaskList from "./TaskList";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useUser } from '../contexts/UserContext';
import supabase from '../supabaseClient';
import AddTaskButton from "./AddTaskButton";

function CategoryPage() {
  const { user } = useUser();
  const { category_id } = useParams();
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const taskListRef = useRef<{ fetchTasks: () => void }>(null);

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
  
          if (data && !Array.isArray(data)) { // Check if data exists and is not an array
            setCategoryName(data.category_name);
          } else {
            console.error('Error fetching category name: No or multiple rows returned');
          }
        }
      } catch (error) {
        console.error('Error fetching category name:', error.message);
      }
    };

    fetchCategoryName();
  }, [user, category_id]);

  const handleTasksUpdated = () => {
    if (taskListRef.current) {
      taskListRef.current.fetchTasks();
    }
  };

  return (
    <Box sx={{ flexGrow: 3, overflow: 'auto', width: '80vw', marginBottom: '100px' }}>
      <Typography variant="h2">{categoryName} Tasks</Typography>
      <TaskList ref={taskListRef} onTasksUpdated={() => setLoading(false)} setLoading={setLoading} />
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      )}
      {/* <AddButton onTaskAdded={handleTasksUpdated} /> */}
      <AddTaskButton onTaskAdded={handleTasksUpdated} />
    </Box>
  );
}

export default CategoryPage;
