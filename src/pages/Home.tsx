import React, { Component } from 'react';
import { UserContext } from '../contexts/UserContext';
import supabase from '../supabaseClient';

import '../Home.css';

interface State {
  tasks: { [key: string]: string[] };
  showAddCategoryInput: boolean;
  newCategoryName: string;
  categoryNames: string[];
  selectedCategory: string | null; // Track the selected category
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
      selectedCategory: null, // Initialize selected category to null
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
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
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
        // Insert the category into the database
        await supabase.from('category').insert([
          { category_name: newCategoryName, user_id: user.user_id },
        ]);
  
        // Check if the newly added category already exists in the categoryNames array
        if (!categoryNames.includes(newCategoryName)) {
          // Log to track when a category is being added
          console.log(`Adding category: ${newCategoryName}`);
  
          // Update local state with the newly added category only if it doesn't already exist
          const updatedCategoryNames = [...categoryNames, newCategoryName];
          this.setState({
            tasks: { ...this.state.tasks, [newCategoryName]: [] },
            newCategoryName: '',
            categoryNames: updatedCategoryNames,
          });
        } else {
          console.log(`Category already exists: ${newCategoryName}`);
        }
      } catch (error) {
        console.error('Error adding category:', error.message);
      }
    }
  };

  handleCategoryClick = (category: string) => {
    this.setState({ selectedCategory: category });
  };

  render() {
    const { showAddCategoryInput, newCategoryName, categoryNames, selectedCategory } = this.state;
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
                <button onClick={() => {
                  this.handleAddCategory();
                  this.setState({ showAddCategoryInput: false });
                }}>Save</button>
              </div>
            )}
            {categoryNames.map((category, index) => (
              <button key={index} onClick={() => this.handleCategoryClick(category)}>
                {category}
              </button>
            ))}
          </nav>
        </aside>
        <main>
          {selectedCategory ? (
            <h1>{selectedCategory} Tasks</h1>
          ) : (
            <h1>Select a category</h1>
          )}
        </main>
      </div>
    );
  }
}

export default Home;
