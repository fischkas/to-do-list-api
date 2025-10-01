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