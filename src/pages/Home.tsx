// Home.tsx
import React, { Component } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { UserContext } from '../contexts/UserContext';
import supabase from '../supabaseClient';

import '../Home.css';

interface State {
  tasks: { [key: string]: string[] };
  showAddCategoryInput: boolean;
  newCategoryName: string;
  categoryNames: string[];
}

class Home extends Component<{}, State> {
  static contextType = UserContext;

  constructor(props: {}) {
    super(props);
    this.state = {
      tasks: {},
      showAddCategoryInput: false,
      newCategoryName: '',
      categoryNames: [],
    };
  }

  async componentDidMount() {
    console.log("Component mounted");
    await this.fetchCategories();
  }

  fetchCategories = async () => {
    try {
      const { user } = this.context;
      console.log("User:", user); // Check if user object is received
      if (user) {
        const { data: categories, error } = await supabase
          .from('category')
          .select('category_name')
          .eq('user_id', user.user_id);

        console.log("Categories:", categories); // Check if categories are fetched
        console.log("Error:", error); // Check if there's any error

        if (error) {
          throw error;
        }

        if (categories) {
          const categoryNames = categories.map((category: any) => category.category_name);
          this.setState({ categoryNames });
          localStorage.setItem('categories', JSON.stringify(categoryNames)); // Save categories to local storage
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  handleAddTask = (category: string, newTask: string) => {
    this.setState((prevState) => ({
      tasks: {
        ...prevState.tasks,
        [category]: [...prevState.tasks[category], newTask],
      },
    }));
  };

  handleToggleAddCategoryInput = () => {
    this.setState((prevState) => ({
      showAddCategoryInput: !prevState.showAddCategoryInput,
    }));
  };

  handleNewCategoryNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCategoryName: event.target.value });
  };

  handleAddCategory = async () => {
    const { newCategoryName, categoryNames } = this.state;
    const { user } = this.context;

    if (newCategoryName.trim() && user) {
      try {
        const { data, error } = await supabase.from('category').insert([
          { category_name: newCategoryName, user_id: user.user_id },
        ]);

        if (error) {
          console.error('Error adding category:', error.message);
        } else {
          const insertedCategory = data?.[0];
          const updatedCategoryNames = [...categoryNames, insertedCategory.category_name];
          this.setState({
            tasks: { ...this.state.tasks, [insertedCategory.category_name]: [] },
            newCategoryName: '',
            showAddCategoryInput: false,
            categoryNames: updatedCategoryNames,
          });
        }
      } catch (error) {
        console.error('Error adding category:', error.message);
      }
    }
  };

  render() {
    const { tasks, showAddCategoryInput, newCategoryName, categoryNames } = this.state;
    const { user } = this.context;

    return (
      <div className="app">
        <aside className="sidebar">
          <h2>QuickTasks</h2>
          {user && (
            <div>
              <p>{user.email}</p>
            </div>
          )}
          <nav className="nav">
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
            {categoryNames.map((category) => (
              <button key={category} onClick={() => console.log(category)}>
                {category}
              </button>
            ))}
          </nav>
        </aside>
        <main>
          {Object.keys(tasks).length > 0 ? (
            <>
              <h1>Tasks</h1>
              {Object.keys(tasks).map((category) => (
                <div key={category}>
                  <h2>{category}</h2>
                  <TaskList tasks={tasks[category]} />
                  <TaskForm onAddTask={this.handleAddTask} currentCategory={category} />
                </div>
              ))}
            </>
          ) : (
            <h1>No categories added yet</h1>
          )}
        </main>
      </div>
    );
  }
}

export default Home;
