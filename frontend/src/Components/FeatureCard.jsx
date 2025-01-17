import React from "react";

const FeatureCard = ({ feature }) => {
  return (
    <div
      className="flex flex-col px-2 py-2 bg-[#213555] mx-auto mt-16 shadow-xl rounded-lg transform transition-transform duration-300 hover:-translate-y-3 hover:shadow-2xl"
      data-aos="flip-up"  // Flip-up effect for the card
    >
      {/* Card Section */}
      <div className="w-full bg-[#213555] rounded-lg p-4">
        {/* Icon Section */}
        <div className="w-20 h-20 mx-auto -mt-16 border-4 border-white rounded-full bg-[#F5EFE7] flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl text-[#3E5879]">{feature.icon}</div>
        </div>

        {/* Title Section */}
        <div className="text-center mt-4 text-white">
          <h2 className="px-3 py-3 font-semibold text-white text-lg">
            {feature.title}
          </h2>
          <p className="text-[#F5EFE7] ">{feature.description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
