import React, { useEffect, useState } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import AddButton from '../components/AddButton';
import supabase from '../supabaseClient';
import { useUser } from '../contexts/UserContext';
import { Pie } from 'react-chartjs-2';

import 'chart.js/auto';

function AllTasksPage() {
  const [categories, setCategories] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('category')
          .select('*')
          .eq('user_id', user.user_id);

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        } else {
          const categoryProgress = await Promise.all(categoriesData.map(async (category) => {
            const { data: tasksData, error: tasksError } = await supabase
              .from('task')
              .select('*')
              .eq('category_id', category.category_id)
              .eq('user_id', user.user_id);

            if (tasksError) {
              console.error('Error fetching tasks:', tasksError);
              return { ...category, completedTasks: 0, totalTasks: 0 };
            } else {
              const completedTasks = tasksData.filter(task => task.completed).length;
              const totalTasks = tasksData.length;
              return { ...category, completedTasks, totalTasks };
            }
          }));
          setCategories(categoryProgress);
        }
      }
    };

    fetchTasks();
  }, [user]);

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h2">All Tasks Page</Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          width: '85vw', // Adjust the maximum width here
          // maxWidth: '1500px', // Adjust the maximum width here
          overflowY: 'auto',
          padding: '10px 0',
          maxHeight:'640px'
        }}
      >
        {categories.map((category) => (
          <Box
            key={category.category_id}
            sx={{
              width: '200px',
              height: '300px',
              border: '1px solid #ccc',
              borderRadius: '20px',
              padding: '15px',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5">{category.category_name}</Typography>
            <Box sx={{ width: '100%', height: '90%', position: 'relative' }}>
              <Pie
                data={{
                  labels: ['Completed', 'Incomplete'],
                  datasets: [
                    {
                      data: [category.completedTasks, category.totalTasks - category.completedTasks],
                      backgroundColor: ['#4caf50', '#6FDCE3'],
                      hoverBackgroundColor: ['#66bb6a', '#B8DBD9'],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}

export default AllTasksPage;
