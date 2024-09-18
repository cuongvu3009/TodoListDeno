<style>
  main {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    text-align: center;
    color: #333;
  }

  input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: calc(100% - 90px);
    margin-right: 10px;
  }

  button {
    padding: 10px 15px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0056b3;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 10px;
  }

  li button {
    background-color: #dc3545;
    margin-left: 10px;
  }

  li button:hover {
    background-color: #c82333;
  }
</style>

<script>
  let todos = [];
  let newTodo = "";

  // Fetch all todos from the server
  const fetchTodos = async () => {
    const res = await fetch("http://localhost:8000/todos");
    todos = await res.json();
  };

  // Add a new todo to the server and update the local todos array
  const addTodo = async () => {
    const response = await fetch("http://localhost:8000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo }),
    });
    const addedTodo = await response.json();
    todos = [...todos, addedTodo]; // Update the local todos array
    newTodo = ""; // Clear input field
  };

  // Delete a todo from the server and update the local todos array
  const deleteTodo = async (id) => {
    // Optimistically remove the todo from the local state
    const updatedTodos = todos.filter(todo => todo.id !== id);
    todos = updatedTodos;

    // Send delete request to the server
    const response = await fetch(`http://localhost:8000/todos/${id}`, { method: "DELETE" });

    // If the request failed, revert the local state change
    if (!response.ok) {
      console.error("Failed to delete todo");
      fetchTodos(); // Re-fetch todos to restore the deleted item
    }
  };

  // Fetch todos initially when the component is mounted
  fetchTodos();
</script>

<main>
  <h1>Todo List</h1>
  <div>
    <input bind:value={newTodo} placeholder="Add a new todo" />
    <button on:click={addTodo}>Add Todo</button>
  </div>

  <ul>
    {#each todos as todo}
      <li>
        {todo.title}
        <button on:click={() => deleteTodo(todo.id)}>Delete</button>
      </li>
    {/each}
  </ul>
</main>
