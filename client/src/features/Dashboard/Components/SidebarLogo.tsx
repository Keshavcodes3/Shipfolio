import { Link } from 'react-router'
import Logo from '../../../components/Logo'

export default function SidebarLogo() {
  return (
    <Link to="/dashboard" className="flex items-center px-5 py-6">
      <Logo size="md" />
    </Link>
  )
}
