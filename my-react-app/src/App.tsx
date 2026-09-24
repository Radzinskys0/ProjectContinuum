import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Data from './pages/Data'
import Master from './pages/Master'
import RequireRole from './auth/RequireRole'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/data" element={<Data />} />
      <Route
        path="/master"
        element={
          <RequireRole role="gm">
            <Master />
          </RequireRole>
        }
      />
    </Routes>
  )
}
