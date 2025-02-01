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
    <ThemeProvider theme={theme}>
      <div className="bg-gradient-to-r from-[#33006F] to-[#4B0082] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
          <nav className="text-2xl font-bold">CODE IDE</nav>
          <div className="flex flex-wrap items-center gap-4">
            {userLoggedIn ? (
              <>
                <Link to="/">
                  <Button className="btn">Home</Button>
                </Link>
                <Link to="/loggeduser">
                  <Button className="btn">CodeBoard</Button>
                </Link>
                <Button
                  onClick={() => {
                    setuserLoggedIn(false);
                    navigate("/login");
                  }}
                  className="btn bg-red-600 hover:bg-red-800"
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link to="/">
                  <button className="flex items-center gap-2  bg-[#720e9e] text-white px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-3 text-sm sm:text-base md:text-lg rounded-3xl shadow-md hover:bg-blue-600 transition">
                    <IoMdHome className="mr-2" /> 
                    <span>Home</span>
                  </button>
                </Link>
                <Link to="/login">
                  <button className="flex items-center gap-2  bg-[#720e9e] text-white px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-3 text-sm sm:text-base md:text-lg rounded-3xl shadow-md hover:bg-blue-600 transition">
                    <MdOutlinePersonOutline className="mr-2" /> 
                    <span>Login</span>
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="flex items-center gap-2  bg-[#720e9e] text-white px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-3 text-sm sm:text-base md:text-lg rounded-3xl shadow-md hover:bg-blue-600 transition">
                    <FaRegPlayCircle className="mr-2" /> 
                    <span>SignUp</span>
                  </button>
                </Link>
                <Link to="/guest">
                  <button className="flex items-center gap-2  bg-[#720e9e] text-white px-4 py-2 sm:px-5 sm:py-2 md:px-6 md:py-3 text-sm sm:text-base md:text-lg rounded-3xl shadow-md hover:bg-blue-600 transition">
                  <IoPersonOutline />
                  <span> Explore</span>                 
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Navbar;