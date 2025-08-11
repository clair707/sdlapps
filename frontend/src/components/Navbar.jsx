import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Unified button style for all navigation links and buttons
  const navButtonClass =
    'px-3 py-2 rounded-md text-sm font-medium bg-green-500/90 hover:bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-200';

  return (
    <nav className="bg-gradient-to-b from-[#C8E6C9] via-[#A5D6A7] via-[#80CBC4] to-[#FFE0B2] backdrop-blur text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight">
            PetVet Care Manager
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                {/* App navigation for authenticated users */}
                <NavLink to="/pets" className={navButtonClass} aria-label="Manage pets">
                  Pets
                </NavLink>
                <NavLink to="/appointments" className={navButtonClass} aria-label="Manage appointments">
                  Appointments
                </NavLink>
                {/* Keep existing Task CRUD link */}
                {/* <NavLink to="/tasks" className={navButtonClass} aria-label="Task CRUD"> 
                  CRUD
                </NavLink>
                <NavLink to="/profile" className={navButtonClass} aria-label="Profile">
                  Profile
                </NavLink>*/}
                <button
                  onClick={handleLogout}
                  className={navButtonClass}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navButtonClass} aria-label="Login">
                  Login
                </NavLink>
                <Link
                  to="/register"
                  className={navButtonClass}
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
