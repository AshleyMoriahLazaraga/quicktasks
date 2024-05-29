import React, { Component } from 'react';
import { UserContext } from '../contexts/UserContext';
import supabase from '../supabaseClient';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import '../Home.css';
import { MoreVert } from '@mui/icons-material';
import TaskForm from '../components/TaskForm.tsx';
import TaskList from '../components/TaskList.tsx';

interface State {
  //tasks: { [key: string]: string[] };
  showAddCategoryInput: boolean;
  newCategoryName: string;
  categoryNames: string[];
  selectedCategory: string | null; // Track the selected category
  anchorEl: HTMLElement | null;
  showAddTaskSidebar: boolean;
  tasks: Task[];

}

interface Task {
  task_id: number;
  title: string;
  description: string;
  dueDate: string;
  user_id: string;
  category_id: string;
}

class Home extends Component<{}, State> {
  static contextType = UserContext;

  constructor(props: {}) {
    super(props);
    this.state = {
      tasks: [],
      showAddCategoryInput: false,
      newCategoryName: '',
      categoryNames: [],
      selectedCategory: null,
      anchorEl: null, // Initialize selected category to null
      showAddTaskSidebar: false
    };
  }

  async componentDidMount() {
    console.log("Component mounted");
    await this.fetchCategories();
    if (this.state.selectedCategory) {
      await this.fetchTasks(); // Fetch tasks when component mounts and a category is selected
    }
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
        
        if (error) {
          console.log("Error:", error); // Check if there's any error

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

  fetchTasks = async () => {
    const { selectedCategory } = this.state;
    const { user } = this.context;

    if (!selectedCategory || !user) {
      return;
    }

    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('category')
        .select('category_id')
        .eq('category_name', selectedCategory)
        .eq('user_id', user.user_id)
        .single();

      if (categoryError) {
        console.error('Error fetching category:', categoryError.message);
        return;
      }

      const category_id = categoryData.category_id;

      const { data: tasks, error } = await supabase
        .from('task')
        .select('*')
        .eq('category_id', category_id)
        .eq('user_id', user.user_id);

      if (error) {
        throw error;
      }

      this.setState({ tasks });
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
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
            // tasks: { ...this.state.tasks, [newCategoryName]: [] },
            tasks: [],
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
  // NEWLY ADDED BY MEE - MARIB
  handleDeleteCategory = async (category: string) => {
    const { categoryNames } = this.state;
    const { user } = this.context;
  
    try {
      // Delete the category from the database
      await supabase.from('category').delete().eq('category_name', category).eq('user_id', user.user_id);
  
      // Remove the deleted category from the local state
      const updatedCategoryNames = categoryNames.filter(cat => cat !== category);
      this.setState({
        categoryNames: updatedCategoryNames,
        // tasks: { ...this.state.tasks, [category]: undefined } // Remove tasks associated with the deleted category
        tasks: [] // Remove tasks associated with the deleted category
        
      });
    } catch (error) {
      console.error('Error deleting category:', error.message);
    }
    console.log('Delete category:', category);
    this.setState({ anchorEl: null });
  };
  //doesnt work. work in progress
  handleEditCategory = async (newCategoryName) => {
    const { selectedCategory, categoryNames } = this.state;
    const { user } = this.context;

    try {
        // Update the category name in the database
        await supabase
            .from('category')
            .update({ category_name: newCategoryName })
            .eq('category_name', selectedCategory)
            .eq('user_id', user.user_id);

        // Update the category name in the local state
        const updatedCategoryNames = categoryNames.map((category) =>
            category === selectedCategory ? newCategoryName : category
        );

        this.setState({
            categoryNames: updatedCategoryNames,
            selectedCategory: newCategoryName // Update the selected category name if needed
        });
    } catch (error) {
        console.error('Error editing category:', error.message);
    }

    this.setState({ anchorEl: null }); // Close the menu
};

  confirmDeleteCategory = (category: string) => {
    const confirmDelete = window.confirm("Are you absolutely sure about deleting this category?");
    if (confirmDelete) {
      this.handleDeleteCategory(category);
    }
  };

  handleCategoryClick = (category: string) => {
    // Set the selected category first, then fetch tasks
    this.setState({ selectedCategory: category }, async () => {
      // Remove active class from previously active category
      const prevActiveCategory = document.querySelector('.categoryRow.active');
      if (prevActiveCategory) {
        prevActiveCategory.classList.remove('active');
      }
  
      // Add active class to the clicked category
      const clickedCategory = document.getElementById(category);
      if (clickedCategory) {
        clickedCategory.classList.add('active');
      }
  
      // Fetch tasks for the selected category after setting the state
      await this.fetchTasks();
    });
  };
  handleMenuOpen = (event, category) => {
    this.setState({ anchorEl: event.currentTarget, selectedCategory: category });
  };
  
  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleAddTaskSidebar = () => {
    this.setState((prevState) => ({
      showAddTaskSidebar: !prevState.showAddTaskSidebar,
    }));
  };

  handleAddTask = async (newTaskData) => {
    const { selectedCategory } = this.state;
    const { user } = this.context;
    
    if (selectedCategory && user) {
      try {
        const { data: categoryData, error: categoryError } = await supabase
          .from('category')
          .select('category_id')
          .eq('category_name', selectedCategory)
          .eq('user_id', user.user_id)
          .single();

        if (categoryError) {
          console.error('Error fetching category:', categoryError.message);
          return;
        }

        const category_id = categoryData.category_id;

        // Add the task to the Supabase database
        await supabase.from('task').insert([
          { 
            user_id: user.user_id,  // Include user_id
            category_id: selectedCategory,  // Include category_id
            ...newTaskData, 
          }
        ]);

        alert('Task successfully added!');
        
        // You might also want to fetch the tasks again after adding a new one
        // to ensure the UI is updated with the latest data
        // Call the fetchTasks function or any function to update tasks
        await this.fetchTasks();
        
      } catch (error) {
        console.error('Error adding task:', error.message);
      }
    } else {
      console.error('No category selected for the task.');
    }
  };
  
  render() {
    const { showAddCategoryInput, newCategoryName, categoryNames, selectedCategory, anchorEl, showAddTaskSidebar, tasks } = this.state;
    const { user } = this.context;

    return (
      <div className="app">
        <main>
          {selectedCategory ? (
            <div>
              <h1 className="pageTitle">{selectedCategory} Tasks</h1>
              <hr style ={{width:'1500px'}}/>
              <div className="homePage">
                <button onClick={this.toggleAddTaskSidebar}>+ Add Task</button>
                {showAddTaskSidebar && (
                  // <aside style={{ backgroundColor: '#EEEEEE', color: '#202124' }}className="taskbar">
                    <TaskForm 
                      onAddTask={this.handleAddTask} 
                      user_id={user.user_id} 
                      selectedCategory={selectedCategory} 
                      toggleAddTaskSidebar={this.toggleAddTaskSidebar} 
                    />
                  // </aside>
                )}
              </div> 
            </div>
          ) : (
            <div>
              <h1 className="pageTitle">Select a category</h1>
              <hr style={{width:'1500px'}}></hr>
            </div>
            
          )}
          <aside style={{ backgroundColor: '#202124', color: '#B8DBD9', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="sidebar">
            <div style={{ flexShrink: 0 }}>
              <img src="src\images\logo_dark.png" alt="Logo" />
              {user && (
                <div>
                  <p>{user.email}</p><br></br>
                  <button style={{padding:'5px'}}onClick={this.handleToggleAddCategoryInput}>Add Category</button>
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
                </div>
              )}
              
            </div>
            <div style={{ overflowY: 'auto', flexGrow: 1 }}>
              <nav className="nav">
                {categoryNames.map((category, index) => (
                  <div key={index} id={category} className="categoryRow">
                    <div key={index} id={category}  onClick={() => this.handleCategoryClick(category)}>
                      {category}
                    </div>
                    <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={(event) => this.handleMenuOpen(event, category)}>
                      <MoreVert />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleMenuClose}                  >
                      <MenuItem onClick={() => this.confirmDeleteCategory(selectedCategory)}>Delete</MenuItem>
                    </Menu>
                  </div>             
                ))}
                 
              </nav>
            </div>
          </aside>
          
          {selectedCategory && (
            <TaskList 
              selectedCategory={selectedCategory} 
              tasks={tasks} 
              //setTasks={this.setState.bind(this, { tasks })} 
            />
          )}
          
        </main>
      </div>
    );
  }
}

export default Home;
