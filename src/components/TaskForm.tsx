import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { UserContext } from '../contexts/UserContext';

function TaskForm({ onAddTask, user_id, selectedCategory }) {
  // static contextType = UserContext;
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

const handleSubmit = async (e) => { 
    e.preventDefault();
    const { title, description, dueDate } = taskData;

    if (title.trim() && dueDate.trim()) {
      try {
        // Call the onAddTask function to save the task to the Supabase database
        const { data: categoryData, error: categoryError } = await supabase
          .from('category')
          .select('category_id')
          .eq('category_name', selectedCategory)
          .single();

        if (categoryError) {
          console.error('Error fetching category:', categoryError.message);
        }

        let categoryid = categoryData?.category_id;

        await supabase.from('task').insert([
          { 
            user_id: user_id,  // Include user_id
            category_id: categoryid,  // Include category_id
            title: title, 
            description: description, 
            // dueDate: dueDate,
            dueDate: new Date(dueDate),
          },
        ]);

        // Clear form fields after task is successfully added
        setTaskData({ title: '', description: '', dueDate: '' });
      } catch (error) {
        console.error('Error adding task:', error.message);
      }
    } else {
      alert('Please enter a title and due date for the task.');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        name="title"
        value={taskData.title}
        onChange={handleChange}
        placeholder="Enter task title"
        required
      />
      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        name="description"
        value={taskData.description}
        onChange={handleChange}
        placeholder="Enter task description"
      />
      <label htmlFor="dueDate">Due Date:</label>
      <input
        type="date"
        id="dueDate"
        name="dueDate"
        value={taskData.dueDate}
        onChange={handleChange}
        required
      />
      <button type="submit">Save</button>
    </form>
  );
}

export default TaskForm;
