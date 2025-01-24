import React, { useEffect } from "react";
import code from "../assets/code_editor.png";
import features from "../data.jsx";
import FeatureCard from "../Components/FeatureCard.jsx";
import Footer from "../Components/Footer.jsx";
import NavBar from "../Components/NavBar.jsx";
import "../index.css";
import AOS from "aos";
import "aos/dist/aos.css"; // AOS CSS

const Home = () => {
  useEffect(() => {

    AOS.init({
      duration: 1000,  
      offset: 200,     
      once: false,      
    });

    window.addEventListener('scroll', AOS.refresh);
    
    return () => {
      window.removeEventListener('scroll', AOS.refresh); 
    };
  }, []);

  return (
    <div>
      <NavBar />

      <div className="text-center py-16 bg-gray-100 shadow-lg" data-aos="fade-up">
        <div
          className="text-3xl font-bold mb-4"
          style={{ fontFamily: "'Candara', sans-serif" }}
        >
          WELCOME TO CODE IDE
        </div>
        <div className="flex justify-center items-center">
          <img
            src={code}
            alt="Code editor screenshot"
            className="max-w-4/5 rounded-lg mt-4 shadow-lg"
            data-aos="zoom-in"
          />
        </div>
      </div>


      <div className="py-24">
        <div className="text-3xl font-bold mb-4 text-center text-[#3E5879]" data-aos="fade-up">
          Features
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="w-full max-w-sm"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
