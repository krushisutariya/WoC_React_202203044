import React from "react";
import { FaTwitterSquare, FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { IoMail } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { createTheme, ThemeProvider, Typography, Container, Grid, Paper, Link } from "@mui/material";
import profile from "../assets/profile.jpg";

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

function Footer() {
  return (
    <ThemeProvider theme={theme}>
      <footer style={{ backgroundColor: theme.palette.primary.main, color: "white", padding: "3rem 0" }}>
        <Container>
          <Grid container spacing={10} justifyContent="center">
            {/* Links Section */}
            <Grid item xs={12} md={2}>
              <Typography variant="h6" style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                <Link href="#!" color="inherit" underline="none">
                  About Us
                </Link>
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Typography variant="h6" style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                <Link href="#!" color="inherit" underline="none">
                  Help
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                <Link href="#!" color="inherit" underline="none">
                  Contact
                </Link>
              </Typography>
            </Grid>
          </Grid>

          <hr style={{ borderColor: "#F5EFE7", marginTop: "2rem" }} />

          {/* Footer Text */}
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              <Typography variant="body1" style={{ textAlign: "center", marginBottom: "2rem" }}>
             Happy coding! Keep building and exploring.
             <br/>
              The world is yours to create. Happy programming!
              </Typography>
            </Grid>
          </Grid>

          {/* Social Media Links */}
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <Link href="https://facebook.com" color="inherit" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={30} />
              </Link>
            </Grid>
            <Grid item>
              <Link href="https://twitter.com" color="inherit" target="_blank" rel="noopener noreferrer">
                <FaTwitterSquare size={30} />
              </Link>
            </Grid>
            <Grid item>
              <Link href="https://www.linkedin.com/in/krushi-sutariya-933150289/" color="inherit" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} />
              </Link>
            </Grid>
            <Grid item>
              <Link href="https://instagram.com" color="inherit" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={30} />
              </Link>
            </Grid>
          </Grid>

          {/* Footer Bottom Section */}
          <Grid container justifyContent="center" style={{ marginTop: "3rem" }}>
            <Typography variant="body2" style={{ textAlign: "center" }}>
              © 2025 Krushi Sutariya | All Rights Reserved
            </Typography>
          </Grid>
        </Container>
      </footer>
    </ThemeProvider>
  );
}

export default Footer;
