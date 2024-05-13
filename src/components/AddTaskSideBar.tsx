import React, { useState } from 'react';
import supabase from '../supabaseClient';

const AddTaskSidebar = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSaveTask = async () => {
    // Validate input
    if (!title.trim() || !description.trim() || !dueDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const { data, error } = await supabase.from('tasks').insert([
        { title, description, due_date: dueDate },
      ]);

      if (error) {
        throw error;
      }

      // Clear input fields
      setTitle('');
      setDescription('');
      setDueDate('');

      // Close the sidebar
      onClose();
    } catch (error) {
      console.error('Error saving task:', error.message);
    }
  };

  return (
    <div className="sidebar">
      <h2>Add Task</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button onClick={handleSaveTask}>Save</button>
    </div>
  );
};

export default AddTaskSidebar;
