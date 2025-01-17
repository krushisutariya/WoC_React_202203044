import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button} from "@mui/material";
import "../index.css";
import {useAuth} from "../Context/AuthContext"
// Define the theme for Navbar (same as footer theme)
const theme = createTheme({
  palette: {
    primary: {
      main: "#213555", // Dark Blue
    },
    secondary: {
      main: "#3E5879", // Blue Gray
    },
    background: {
      default: "#F5EFE7", // Light Beige
      paper: "#D8C4B6", // Light Tan
    },
    text: {
      primary: "#213555", // Dark Blue for text
      secondary: "#3E5879", // Blue Gray for secondary text
    },
  },
  typography: {
    fontFamily: "'Candara', sans-serif", // Font family as specified
  },
});

const Navbar = () => {
  
  const navigate = useNavigate();
  const {userLoggedIn, setuserLoggedIn} = useAuth();
  const handleLogout = () => {
    setuserLoggedIn(false);  // This should reset the login state
    toast.success("Logged out successfully!");
    navigate("/");  // Redirect to the homepage or login page after logging out
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="bg-[#213555] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Navigation Links */}
          <nav className="text-2xl">CODE IDE</nav>


          <div className="flex items-center space-x-4">
            { 
               userLoggedIn
               ? 
              (
              <>
                
                <Button
                  onClick={()=>{
                    setuserLoggedIn(false);
                    navigate("/login")}}
                  variant="contained"
                  color="error"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#b71c1c", // Red on hover
                    },
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#F5EFE7",
                        color: "#213555",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#F5EFE7",
                        color: "#213555",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    SignUp
                  </Button>
                </Link>
                <Link to="/guest">
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#F5EFE7",
                        color: "#213555",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    Explore
                  </Button>
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
