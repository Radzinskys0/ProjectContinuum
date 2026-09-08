import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'

type Todo = {
  id: number
  todo: string
  created_at: string
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const addTodo = async ()=> {
    const newTodoData = {
      todo: newTodo,
      created_at: new Date().toISOString(),
    };

    const {data, error} = await supabase
    .from("todos")
    .insert([newTodoData])
    .select()
    .single();
    if (error){
      console.log("error adding...", error);
    } else { setTodos((prev) => [...prev, data])
      setNewTodo("");
    }
  };

  useEffect(() => {
    async function getTodos() {
      const { data: todos } = await supabase.from('todos').select("*")

      if (todos) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])

  return (
    <div>
      <input type="text" placeholder='new toDo' value={newTodo} onChange={(e) => setNewTodo(e.target.value)}></input>
          <button onClick={addTodo}>add todo item</button>
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.todo}</li>
      ))}
    </ul>
    </div>
  )
}