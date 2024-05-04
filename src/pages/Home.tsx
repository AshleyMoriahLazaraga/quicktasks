import React, { Component } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import SettingsButton from '../components/SettingsButton';
import '../Home.css'; // Import the CSS file for styling

interface State {
  currentCategory: string;
  tasks: { [key: string]: string[] };
  showAddCategoryInput: boolean;
  newCategoryName: string;
}

class Home extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentCategory: 'SCHOOL',
      tasks: { SCHOOL: [] },
      showAddCategoryInput: false,
      newCategoryName: '',
    };
  }

  handleAddTask = (category: string, newTask: string) => {
    this.setState((prevState) => ({
      tasks: {
        ...prevState.tasks,
        [category]: [...prevState.tasks[category], newTask],
      },
    }));
  };

  handleCategoryChange = (newCategory: string) => {
    this.setState({ currentCategory: newCategory });
  };

  handleToggleAddCategoryInput = () => {
    this.setState((prevState) => ({
      showAddCategoryInput: !prevState.showAddCategoryInput,
    }));
  };

  handleNewCategoryNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCategoryName: event.target.value });
  };

  handleAddCategory = () => {
    const { newCategoryName } = this.state;
    if (newCategoryName.trim()) {
      this.setState((prevState) => ({
        tasks: { ...prevState.tasks, [newCategoryName]: [] },
        newCategoryName: '',
        showAddCategoryInput: false,
      }));
    }
  };

  render() {
    const { currentCategory, tasks, showAddCategoryInput, newCategoryName } = this.state;
    return (
      <div className="app">
        <aside className="sidebar">
          <h2>QuickTasks</h2>
          <nav className="nav">
            <SettingsButton />
            <button onClick={this.handleToggleAddCategoryInput}>Add Category</button>
            {showAddCategoryInput && (
              <div>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={this.handleNewCategoryNameChange}
                  placeholder="Enter new category name"
                />
                <button onClick={this.handleAddCategory}>Save</button>
              </div>
            )}
            {Object.keys(tasks).map((category) => (
              <button key={category} onClick={() => this.handleCategoryChange(category)}>
                {category}
              </button>
            ))}
          </nav>
        </aside>
        <main>
          <h1>{currentCategory} Tasks</h1>
          <TaskList tasks={tasks[currentCategory]} />
          <TaskForm onAddTask={this.handleAddTask} currentCategory={currentCategory} />
        </main>
      </div>
    );
  }
}

export default Home;
