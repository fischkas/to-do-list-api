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

todos = [] # Only saved in memory for now...

class Todo(BaseModel):
    title: str
    completed: bool = False

@app.get("/todos")
def get_todos():
    return todos

@app.get("/todos/{index}")
def get_single_todo(index: int):

	if 0 <= index < len(todos):
		return todos[index]
	else:
		return {"error": "Invalid index"}

@app.get("/todos/{index}")
def about(index: int):
	if 0 <= index < len(todos):
		return todos[index].title
	else:
		return {"error": "Invalid index"}


@app.post("/todos")
def add_todo(todo: Todo):
    todos.append(todo)
    return {"message": "Todo added"}

@app.delete("/todos/{index}")
def delete_todo(index: int):
    if 0 <= index < len(todos):
        todos.pop(index)
        return {"message": "Todo deleted"}
    return {"error": "Invalid index"}


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