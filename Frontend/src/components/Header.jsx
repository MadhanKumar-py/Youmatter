import Button from "./Button";
import {Link} from 'react-router-dom'
import logo from '../assets/Logo.png'
import { useAuth } from './auth/AuthContext';

function Header() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="navbar bg-green-100/70 shadow-sm px-2 sm:px-4 min-h-12 sm:min-h-16 relative">
      {/* Navbar Start */}
      <div className="navbar-start flex-1 min-w-0">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 6h16M4 12h8m-8 6h16" 
              />
            </svg>
          </div>

          {/* Mobile Menu */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-offWhite rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/" className="text-darkGreen hover:bg-lighterGreen hover:text-neutralGray rounded-md">
                Home
              </Link>
            </li>
            <li>
              <Link to="/checkIn" className="text-darkGreen hover:bg-lighterGreen hover:text-neutralGray rounded-md">
                Check-in
              </Link>
            </li>
            <li>
              <Link to="/journal" className="text-darkGreen hover:bg-lighterGreen hover:text-neutralGray rounded-md">
                Journal
              </Link>
            </li>
            <li>
              <Link to="/calming" className="text-darkGreen hover:bg-lighterGreen hover:text-neutralGray rounded-md">
                Calming Tools
              </Link>
            </li>
            <li>
              <Link to="/psychartists" className="text-darkGreen hover:bg-lighterGreen hover:text-neutralGray rounded-md">
                Psychartists
              </Link>
            </li>

            <li>
              <button 
                onClick={() => document.getElementById('my_modal_5').showModal()}
                className="text-red-600 font-semibold hover:bg-[#FDE2E2] rounded-md text-left w-full"
              >
                Get Help Now
              </button>
            </li>

            {!isAuthenticated && (
              <>
                <li>
                  <button 
                    onClick={() => document.getElementById('login_modal').showModal()}
                    className="text-darkGreen hover:bg-lighterGreen hover:text-neutralGray rounded-md text-left w-full"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('register_modal').showModal()}
                    className="text-darkGreen hover:bg-lighterGreen hover:text-neutralGray rounded-md text-left w-full"
                  >
                    Register
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Logo - Always visible title */}
        <Link to="/" className="btn btn-ghost text-darkGreen font-semibold hover:bg-transparent flex items-center gap-1 sm:gap-2 text-sm sm:text-base md:text-lg px-1 sm:px-2 md:px-4">
          <img src={logo} alt="YouMatter Logo" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
          <span className="text-sm sm:text-base md:text-lg font-bold">YouMatter</span>
        </Link>
      </div>

      {/* Navbar Center (Desktop Menu) - Show at 1024px+ */}
      <div className="navbar-center hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/" className="text-darkGreen hover:bg-lighterGreen hover:text-neutralGray px-4 rounded-md transition-all text-sm lg:text-base">
              Home
            </Link>
          </li>
          <li>
            <Link to="/checkIn" className="text-darkGreen hover:bg-lighterGreen hover:text-neutralGray px-4 rounded-md transition-all text-sm lg:text-base">
              Check-in
            </Link>
          </li>
          <li>
            <Link to="/journal" className="text-darkGreen hover:bg-lighterGreen hover:text-neutralGray px-4 rounded-md transition-all text-sm lg:text-base">
              Journal
            </Link>
          </li>
          <li>
            <Link to="/calming" className="text-darkGreen hover:bg-lighterGreen hover:text-neutralGray px-4 rounded-md transition-all text-sm lg:text-base">
              Calming Tools
            </Link>
          </li>
          <li>
            <Link to="/psychartists" className="text-darkGreen hover:bg-lighterGreen hover:text-neutralGray px-4 rounded-md transition-all text-sm lg:text-base">
              Psychartists
            </Link>
          </li>
        </ul>
      </div>

      {/* Navbar End - Responsive buttons */}
      <div className="navbar-end gap-1 sm:gap-2 flex-shrink-0">
        <Button 
          text="Get Help Now" 
          class="btn hidden lg:block btn-error bg-emergencyButton border-none hover:bg-[#C54949] text-white text-xs lg:text-sm px-2 lg:px-3 min-h-0 h-8 lg:h-9" 
          click={() => document.getElementById('my_modal_5').showModal()} 
        />
        
        {isAuthenticated ? (
          <Link to="/profile" className="btn btn-ghost px-1 sm:px-2 md:px-3 min-h-0 h-8 sm:h-10 md:h-12">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-darkGreen text-white rounded-full flex items-center justify-center text-xs font-semibold">
                {user?.username?.charAt(0) || user?.email?.charAt(0)}
              </div>
              <span className="hidden md:block text-darkGreen text-xs sm:text-sm md:text-base max-w-16 sm:max-w-20 lg:max-w-none truncate">
                {user?.username}
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex gap-1">
            <Button 
              text="Login" 
              class='btn border-primarySoftGreen text-darkGreen hover:bg-lighterGreen hover:border-darkGreen text-xs lg:text-sm px-2 lg:px-3 min-h-0 h-8 lg:h-9'
              click={() => document.getElementById('login_modal').showModal()}
            />
            <Button 
              text="Sign Up" 
              class='btn bg-darkGreen text-white hover:bg-neutralGray text-xs lg:text-sm px-2 lg:px-3 min-h-0 h-8 lg:h-9'
              click={() => document.getElementById('register_modal').showModal()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
