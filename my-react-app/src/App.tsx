import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Data from './pages/Data'
import Master from './pages/Master'
import Profile from './pages/Profile'
import Forum from './pages/forum/Forum'
import Topic from './pages/forum/Topic'
import Thread from './pages/forum/Thread'
import RequireRole from './auth/RequireRole'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/data" element={<Data />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/forum/topic/:topicId" element={<Topic />} />
      <Route path="/forum/thread/:threadId" element={<Thread />} />
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
