import { useNavigate } from 'react-router-dom'
import TodoList from '../components/TodoList'

export default function Data() {
  const navigate = useNavigate()

  return (
    <div>
      <button onClick={() => navigate('/')}>Go back</button>
      <TodoList />
    </div>
  )
}
