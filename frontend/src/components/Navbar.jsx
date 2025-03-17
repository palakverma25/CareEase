/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData, setUserData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  // ✅ Load token & user data from localStorage safely
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userData");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData)); // Safely parse userData
      } catch (error) {
        console.error("Error parsing userData:", error);
        setUserData(null);
        localStorage.removeItem("userData"); // Reset if corrupt
      }
    }
  }, []);

  // ✅ Logout Function (Clears everything)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setToken(null);
    setUserData(null);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/" className="hover:text-primary">
          <li className="py-1">HOME</li>
        </NavLink>
        <NavLink to="/doctors" className="hover:text-primary">
          <li className="py-1">ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about" className="hover:text-primary">
          <li className="py-1">ABOUT</li>
        </NavLink>
        <NavLink to="/contact" className="hover:text-primary">
          <li className="py-1">CONTACT</li>
        </NavLink>
      </ul>

      {/* Right Side (Login / User Profile) */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          // ✅ Show Profile Picture if Logged In
          <div className="relative group cursor-pointer">
            <img className="w-10 h-10 rounded-full" src={userData.image} alt="Profile Pic" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown Icon" />
            <div className="absolute right-0 pt-14 hidden group-hover:block">
              <div className="bg-white shadow-lg rounded-md p-4 w-48">
                <p onClick={() => navigate("/my-profile")} className="hover:text-primary cursor-pointer">
                  My Profile
                </p>
                <p onClick={() => navigate("/my-appointments")} className="hover:text-primary cursor-pointer">
                  My Appointments
                </p>
                <p onClick={logout} className="hover:text-red-500 cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          // ✅ Show "Create Account" button if not logged in
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu Icon"
        />

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-3/4 bg-white z-50 transition-transform ${
            showMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="Logo" />
            <img
              className="w-7 cursor-pointer"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="Close Icon"
            />
          </div>
          <ul className="flex flex-col items-center gap-5 mt-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">HOME</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">ALL DOCTORS</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">ABOUT</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">CONTACT</NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
