import React from "react";
import { FaTwitterSquare, FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { IoMail } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import profile from "../assets/profile.jpg";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#33006F] to-[#452c63] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-10 text-center md:text-left">
          {/* Links Section */}
          <div>
            <p className="text-lg font-bold text-uppercase mb-4">About Us</p>
        
          </div>
          <div>
            <p className="text-lg font-bold text-uppercase mb-4">Help</p>
            
          </div>
          <div>
            <p className="text-lg font-bold text-uppercase mb-4">Contact</p>
          </div>
        </div>

        <hr className="border-t-2 border-[#F5EFE7] my-8" />

        {/* Footer Text */}
        <div className="text-center mb-8">
          <p className="text-lg">
            Happy coding! Keep building and exploring.
            <br />
            The world is yours to create. Happy programming!
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-4 mb-8">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5EFE7]">
            <FaFacebook size={30} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5EFE7]">
            <FaTwitterSquare size={30} />
          </a>
          <a href="https://www.linkedin.com/in/krushi-sutariya-933150289/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5EFE7]">
            <FaLinkedin size={30} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5EFE7]">
            <FaInstagram size={30} />
          </a>
        </div>

        {/* Footer Bottom Section */}
        <div className="text-center">
          <p className="text-sm">© 2025 Krushi Sutariya | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
