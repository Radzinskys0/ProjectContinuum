import { Outlet } from 'react-router-dom'
import AuthButton from './AuthButton'

export default function Layout() {
  return (
    <>
      <AuthButton />
      <Outlet />
    </>
  )
}
