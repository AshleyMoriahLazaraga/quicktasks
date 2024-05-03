import React, { useState } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import SettingsButton from '../components/SettingsButton';

const Home: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<string>('SCHOOL'); // Initial category
  const [tasks, setTasks] = useState<{ [key: string]: string[] }>({ SCHOOL: [] }); // State for tasks by category

  const handleAddTask = (category: string, newTask: string) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [category]: [...prevTasks[category], newTask],
    }));
  };

  const handleCategoryChange = (newCategory: string) => {
    setCurrentCategory(newCategory);
  };

  return (
    <div className="app">
      <aside className="menu">
        <h2>QuickTasks</h2>
        <nav>
          <button onClick={() => handleCategoryChange('SCHOOL')}>SCHOOL</button>
          {/* Add more buttons for additional categories as needed */}
          <SettingsButton /> {/* We'll create a separate component for Settings */}
        </nav>
        <button onClick={() => handleCategoryChange('NEW_CATEGORY')}>Add Category</button>
      </aside>
      <main>
        <h1>{currentCategory} Tasks</h1>
        <TaskList tasks={tasks[currentCategory]} />
        <TaskForm onAddTask={handleAddTask} currentCategory={currentCategory} />
      </main>
    </div>
  );
}

export default Home;
