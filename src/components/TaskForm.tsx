import React, { useState } from 'react';

function TaskForm({ onAddTask, currentCategory }) {
  const [newTaskText, setNewTaskText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(currentCategory, { id: Date.now(), text: newTaskText }); // Generate unique ID
      setNewTaskText('');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="new-task">Add Task:</label>
      <input
        type="text"
        id="new-task"
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        placeholder="Enter task description"
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default TaskForm;
