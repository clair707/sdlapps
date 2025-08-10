import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const baseLink = 'px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200';
  const inactive = 'text-white/90 hover:text-white hover:bg-white/10';
  const active = 'bg-white/15 text-white shadow-sm';
  const navClass = ({ isActive }) => `${baseLink} ${isActive ? active : inactive}`;

  return (
    <nav className="bg-blue-600/90 backdrop-blur text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight">
            PetVet Care Manager
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                {/* App navigation for authenticated users */}
                <NavLink to="/pets" className={navClass} aria-label="Manage pets">
                  Pets
                </NavLink>
                <NavLink to="/appointments" className={navClass} aria-label="Manage appointments">
                  Appointments
                </NavLink>
                {/* Keep existing Task CRUD link */}
                <NavLink to="/tasks" className={navClass} aria-label="Task CRUD">
                  CRUD
                </NavLink>
                <NavLink to="/profile" className={navClass} aria-label="Profile">
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="ml-1 bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass} aria-label="Login">
                  Login
                </NavLink>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-green-500/90 hover:bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-200"
                  aria-label="Register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
