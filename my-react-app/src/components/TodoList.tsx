import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

type Todo = {
  id: number
  todo: string
  created_at: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [deleteText, setDeleteText] = useState("")
  const [deleteMessage, setDeleteMessage] = useState("")
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

  const deleteTodo = async () => {
    const match = todos.find((t) => t.todo === deleteText)
    if (!match) {
      setDeleteMessage('No todo with that exact text.')
      return
    }

    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', match.id)
      .select()
    if (error || !data || data.length === 0) {
      setDeleteMessage(error ? error.message : 'Delete failed.')
    } else {
      setTodos((prev) => prev.filter((t) => t.id !== match.id))
      setDeleteText('')
      setDeleteMessage('')
    }
  }

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
      <div>
        <input
          type="text"
          placeholder="todo to delete (exact text)"
          value={deleteText}
          onChange={(e) => {
            setDeleteText(e.target.value)
            setDeleteMessage('')
          }}
        ></input>
        <button onClick={deleteTodo}>delete todo item</button>
        {deleteMessage && <p>{deleteMessage}</p>}
      </div>
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.todo}</li>
      ))}
    </ul>
    </div>
  )
}
