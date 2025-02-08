import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hamburger } from "../assets/icons";
import { headerLogo } from "../assets/images";
import { navLinks, LoggedINnavLinks } from "../constants";
import { logout } from "../Slices/loginSlice";
import { Link } from "react-router-dom";

const Nav = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // State for hamburger menu
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="padding-x py-8 absolute z-10 w-full">
      <nav className="flex justify-between items-center max-container">
        {/* Logo */}
        <Link to="/">
          <img
            src={headerLogo}
            alt="logo"
            width={129}
            height={29}
            className="m-0 w-[129px] h-[29px]"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="flex-1 flex justify-center items-center gap-16 hidden lg:flex">
          {(userInfo ? LoggedINnavLinks : navLinks).map((item) => (
            <li key={item.label}>
              <Link
                to={item.href} // ✅ Changed from href to to
                className="font-montserrat leading-normal text-lg text-slate-gray"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Info and Buttons (Hidden on Mobile) */}
        {userInfo ? (
          <div className="hidden lg:flex items-center gap-6 font-montserrat text-lg leading-normal text-slate-gray">
            <span className="font-medium text-slate-gray">
              Welcome,{" "}
              <span className="font-semibold text-gray-500">
                {userInfo.name}
              </span>
            </span>
            <button
              onClick={logoutHandler}
              className="px-4 py-2 bg-gray-500 hover:bg-red-700 text-white rounded-lg transition-all duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex gap-2 text-lg leading-normal font-medium font-montserrat wide:mr-24">
            <Link
              to="/signup"
              className="text-slate-gray hover:text-black transition-all duration-300"
            >
              Sign up
            </Link>
            <span>/</span>
            <Link
              to="/login"
              className="text-slate-gray hover:text-black transition-all duration-300"
            >
              Log in
            </Link>
          </div>
        )}

        {/* Hamburger Menu for Smaller Screens */}
        <div className="flex lg:hidden relative">
          <img
            src={hamburger}
            alt="hamburger icon"
            width={25}
            height={25}
            onClick={toggleMenu}
            className="cursor-pointer"
          />
        {/* Mobile Menu */}
{menuOpen && (
  <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-20">
    <ul className="flex flex-col gap-4">
      {(userInfo ? LoggedINnavLinks : navLinks).map((item) => (
        <li key={item.label}>
          <Link
            to={item.href}
            onClick={() => setMenuOpen(false)} // ✅ Close menu after clicking
            className="font-montserrat text-lg text-slate-gray hover:text-black transition-all duration-300"
          >
            {item.label}
          </Link>
        </li>
      ))}
      {userInfo && (
        <li>
          <button
            onClick={() => {
              logoutHandler();
              setMenuOpen(false); // ✅ Close menu after logout
            }}
            className="w-full px-4 py-2 bg-gray-500 hover:bg-red-700 text-white rounded-lg transition-all duration-300"
          >
            Logout
          </button>
        </li>
      )}
      {!userInfo && (
        <li className="flex justify-between">
          <Link
            to="/signup"
            onClick={() => setMenuOpen(false)} // ✅ Close menu after clicking
            className="text-slate-gray hover:text-black transition-all duration-300"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)} // ✅ Close menu after clicking
            className="text-slate-gray hover:text-black transition-all duration-300"
          >
            Log in
          </Link>
        </li>
      )}
    </ul>
  </div>
)}

        </div>
      </nav>
    </header>
  );
};

export default Nav;

