// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

axios.get('https://todo-backend-t4m9.onrender.com')
  .then((response) => {
    // handle response
  });

// Import the GIF if you have it
import DogSpinningGif from './assets/dog-spinning.gif'; // Adjust the path as needed

function App() {
  // State variables
  const [todos, setTodos] = useState([]); // List of todo items
  const [text, setText] = useState(''); // Text input value
  const [isEditing, setIsEditing] = useState(false); // Editing mode flag
  const [currentTodoId, setCurrentTodoId] = useState(null); // ID of the todo being edited

  // Fetch todos from the backend when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:5000/todos')
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });
  }, []);

  // Function to handle adding a new todo or saving an edited todo
  const handleSubmit = () => {
    if (text.trim() === '') return; // Do nothing if input is empty

    if (isEditing) {
      // Editing an existing todo
      axios
        .put(`http://localhost:5000/todos/${currentTodoId}`, { text })
        .then((response) => {
          // Update the todo in the state
          setTodos(
            todos.map((t) =>
              t._id === currentTodoId ? response.data : t
            )
          );
          resetForm(); // Reset the form to initial state
        })
        .catch((error) => {
          console.error('Error updating todo:', error);
        });
    } else {
      // Adding a new todo
      axios
        .post('http://localhost:5000/todos', { text })
        .then((response) => {
          setTodos([...todos, response.data]); // Add the new todo to the list
          setText(''); // Clear the input field
        })
        .catch((error) => {
          console.error('Error adding todo:', error);
        });
    }
  };

  // Function to toggle the completion status of a todo
  const toggleComplete = (id) => {
    const todo = todos.find((t) => t._id === id);
    axios
      .put(`http://localhost:5000/todos/${id}`, {
        completed: !todo.completed,
      })
      .then((response) => {
        setTodos(
          todos.map((t) =>
            t._id === id ? { ...t, completed: response.data.completed } : t
          )
        );
      })
      .catch((error) => {
        console.error('Error toggling todo:', error);
      });
  };

  // Function to delete a todo
  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:5000/todos/${id}`)
      .then(() => {
        setTodos(todos.filter((t) => t._id !== id)); // Remove the todo from the list
      })
      .catch((error) => {
        console.error('Error deleting todo:', error);
      });
  };

  // Function to initiate editing a todo
  const editTodo = (id, currentText) => {
    setIsEditing(true); // Enter editing mode
    setCurrentTodoId(id); // Set the current todo ID
    setText(currentText); // Populate the input field with the current text
  };

  // Function to reset the form to its initial state
  const resetForm = () => {
    setIsEditing(false); // Exit editing mode
    setCurrentTodoId(null); // Clear the current todo ID
    setText(''); // Clear the input field
  };

  return (
    <div className="app">
      <div className="content">
        <h1>Enhanced Todo List</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className={isEditing ? 'save-button' : ''}
          >
            {isEditing ? 'Save' : 'Add Task'}
          </button>
          {isEditing && (
            <button onClick={resetForm} className="cancel-button">
              Cancel
            </button>
          )}
        </div>
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id} className={todo.completed ? 'completed' : ''}>
              <span onClick={() => toggleComplete(todo._id)}>{todo.text}</span>
              <div className="actions">
                <button onClick={() => editTodo(todo._id, todo.text)}>e</button>
                <button onClick={() => deleteTodo(todo._id)}>X</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="gif-container">
        <img src={DogSpinningGif} alt="Dog Spinning" />
      </div>
    </div>
  );
}

export default App;
