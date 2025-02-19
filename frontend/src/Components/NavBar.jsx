import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button } from "@mui/material";
import { useAuth } from "../Context/AuthContext";
import { MdOutlinePersonOutline } from "react-icons/md";
import { FaRegPlayCircle } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";

const theme = createTheme({
  palette: {
    primary: {
      main: "#213555",
    },
    secondary: {
      main: "#3E5879",
    },
    background: {
      default: "#F5EFE7",
      paper: "#D8C4B6",
    },
    text: {
      primary: "#213555",
      secondary: "#3E5879",
    },
  },
  typography: {
    fontFamily: "'Candara', sans-serif",
  },
});

const Navbar = () => {
  const navigate = useNavigate();
  const { userLoggedIn, setuserLoggedIn } = useAuth();

  return (
    <div className="bg-gradient-to-r from-[#33006F] to-[#800080] text-white shadow-md h-[10vh]  md:overflow-y-auto">

    <div className="container mx-auto my-auto px-2 py-4 flex flex-wrap justify-between items-center">
      <nav className="text-3xl font-bold">CODE IDE</nav>
      <div className="flex flex-wrap items-center gap-2">
        {userLoggedIn ? (
          <>
            <Link to="/">
              <button className="flex items-center gap-1 bg-[#33006F] text-white px-4 py-2 text-sm sm:text-base md:text-lg rounded-3xl shadow-md hover:bg-[#720e9e] transition">
                Home
              </button>
            </Link>
            <Link to="/loggeduser">
              <button className="flex items-center gap-1 bg-[#33006F] text-white px-4 py-2 text-sm sm:text-base md:text-lg rounded-3xl shadow-md hover:bg-[#720e9e] transition">
                CodeBoard
              </button>
            </Link>
            <button
              onClick={() => {
                setuserLoggedIn(false);
                navigate("/login");
              }}
              className="flex items-center gap-1 bg-[#33006F] text-white px-4 py-2 text-sm sm:text-base md:text-lg rounded-3xl shadow-md hover:bg-[#720e9e] transition"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/">
              <button className="flex items-center  gap-1 bg-[#33006F] text-white px-4 py-2 sm:text-base md:text-lg rounded-3xl shadow-md hover:bg-[#720e9e] transition">
                <IoMdHome className="mr-1" />
                <span>Home</span>
              </button>
            </Link>
            <Link to="/login">
              <button className="flex items-center gap-1 bg-[#33006F] text-white px-4 py-2 text-sm sm:text-base md:text-lg rounded-3xl shadow-md hover:bg-[#720e9e] transition">
                <MdOutlinePersonOutline className="mr-1" />
                <span>Login</span>
              </button>
            </Link>
            <Link to="/signup">
              <button className="flex items-center gap-1 bg-[#33006F] text-white px-4 py-2 text-sm sm:text-base md:text-lg rounded-3xl shadow-md hover:bg-[#720e9e] transition">
                <FaRegPlayCircle className="mr-1" />
                <span>SignUp</span>
              </button>
            </Link>
            <Link to="/guest">
              <button className="flex items-center gap-1 bg-[#33006F] text-white px-4 py-2 text-sm sm:text-base md:text-lg rounded-3xl shadow-md hover:bg-[#720e9e] transition">
                <IoPersonOutline className="mr-1" />
                <span>Explore</span>
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  </div>
  
  );
};

export default Navbar;