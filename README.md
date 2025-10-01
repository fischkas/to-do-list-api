# 🐍 Full Setup: Backend + Frontend with Python Environment on Windows CMD 🐍

### 1. Project folder structure

Let's define the project structure first. This helps keep your code organized.


Example Project Structure:
```
my-todo-app/
├── backend/          # FastAPI backend code + virtual environment
│   ├── main.py       # Your FastAPI app code
│   └── venv/         # Python virtual environment
└── frontend/         # React + Vite frontend
    ├── src/          # React source files
    ├── public/       # Static files
    ├── package.json  # Frontend dependencies & scripts
    └── vite.config.js # Vite config file
```
### What to do:

Inside backend/, create your Python virtual environment (venv) and your main backend file main.py

Inside frontend/, create your React app using npm create vite@latest frontend --template react

Put React code inside frontend/src/ — for example, your main component is App.jsx

### How to read it:

├── means "contains"

Indentation shows hierarchy

Files end with / if folder, else just file names

'#' are comments to explain

### 2. Step-by-step: Backend Setup (Python + FastAPI)

Open Command Prompt

Navigate to your working directory in windows cmd (in my case)

```cmd
cd C:\Users\YourName\Documents
mkdir my-todo-app
cd my-todo-app
mkdir backend
cd backend
Create Python virtual environment and activate it
python -m venv venv
venv\Scripts\activate.bat
```

```python -m venv venv``` — creates a folder called venv with the virtual environment.

```venv\Scripts\activate.bat``` — activates the virtual environment in CMD.

If activation worked, your prompt changes to something like:
```(venv) C:\Users\YourName\Documents\my-todo-app\backend> pip install fastapi uvicorn```

Create a file called main.py, which is my backend API file to define the endpoints!
We don't connect to a database just yet, as I'm just trying to understand the API and don't want to get bugged into setting up a database with SQLlite (that's for later!!)

In backend/ folder, create main.py with this content:


```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS so frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for todos
todos = []

# Pydantic model for incoming todo data
class Todo(BaseModel):
    title: str
    completed: bool = False

# GET: List all todos
@app.get("/todos")
def get_todos():
    return todos

@app.get("/todos/{index}")
def get_single_todo(index: int):

	if 0 <= index < len(todos):
		return todos[index]
	else:
		return {"error": "Invalid index"}

# POST: Add a new todo
@app.post("/todos")
def add_todo(todo: Todo):
    todos.append(todo)
    return {"message": "Todo added"}

# DELETE: Remove a todo by index
@app.delete("/todos/{index}")
def delete_todo(index: int):
    if 0 <= index < len(todos):
        todos.pop(index)
        return {"message": "Todo deleted"}
    return {"error": "Index out of range"}


@app.patch("/todos/{index}")
def mark_todo_complete(index: int):
	if 0 <= index < len(todos):
		if todos[index].completed != True:
			todos[index].completed = True
			return {"message": "Todo marked as complete"}
		else:
			return {"message": "Todo already marked as complete"}
	else:
		return {"error": "Invalid index"}

```

Run your FastAPI backend server

```cmd
uvicorn main:app --reload
```
Open your browser to:

[http://localhost:8000/docs](http://localhost:8000/docs)

### Step-by-Step: Frontend (React + Vite) Setup

Open a new terminal (don’t close the one running your API)

Open a new terminal window (not a new tab) and run:

```cmd
cd C:\Users\YourName\Documents\my-todo-app
npx create-vite@latest frontend --template react
cd frontend
npm install
npm run dev
```

Your frontend will start at:

[http://localhost:5173](http://localhost:5173)

Modify frontend/src/App.jsx

Replace the contents of App.jsx with:

```javascript

import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:8000'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')

  const fetchTodos = async () => {
    const res = await fetch(`${API_URL}/todos`)
    const data = await res.json()
    setTodos(data)
  }

  const addTodo = async () => {
    await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })
    setTitle('')
    fetchTodos()
  }

  const deleteTodo = async (index) => {
    await fetch(`${API_URL}/todos/${index}`, { method: 'DELETE' })
    fetchTodos()
  }

 const markComplete = async (index) => {
    await fetch(`${API_URL}/todos/${index}`, { method: 'PATCH' })
      fetchTodos()
    }


  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>🧠📌 My to-do list</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task..." />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo.completed ? <s>{todo.title}</s> : todo.title}
            <button onClick={() => deleteTodo(i)}>❌</button>
            {!todo.completed && (
              <button onClick={() => markComplete(i)}>✅</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
export default App
```

### 4. Summary of your workflow

Use one Command Prompt window for backend:

```cmd
cd my-todo-app\backend
venv\Scripts\activate.bat
uvicorn main:app --reload
Use another Command Prompt window for frontend:
cd my-todo-app\frontend
npm run dev
```

### Succes! 

Now I'm able to run a frontend using vibe-coded react and a backend. However, this is not a full backend yet since the backend only contains the main.py file which is were we define the API.
The API is part of the backend, but not the whole. The data from the to-do list is stored in memory at the top of main.py.

#### What's in my Backend Right Now

| Component                | Description                           | Where It Lives                                      |
| ------------------------ | ------------------------------------- | --------------------------------------------------- |
| **API layer**            | Endpoints that expose data (`/todos`) | Decorated functions (`@app.get`, etc.) in `main.py` |
| **Business logic**       | Code that adds/removes items          | Inside the same functions                           |
| **In-memory data store** | Your `todos = []` list                | At the top of `main.py`                             |
| **Server**               | FastAPI app + Uvicorn server          | Run via `uvicorn main:app --reload`                 |


![Uploading {1DDC3764-4B14-4DB7-B748-BB28E5F3B3B7}.png…]()


