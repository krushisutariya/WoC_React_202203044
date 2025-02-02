import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import Navbar from "../../Components/NavBar";
import Footer from "../../Components/Footer";
const OtpVerification = () => {
  const { email, otp } = useAuth();
  const [disable, setDisable] = useState(true);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [timerCount, setTimer] = useState(60);

  const navigate = useNavigate();

  const resendOTP = () => {
    navigate("/forgotpassword");
  };

  const verifyOTP = () => {
    console.log(OTPinput.join(""));

    if (OTPinput.join("") === otp) {
      navigate("/resetpassword");
    } else {
      alert("The OTP entered is incorrect. Please try again.");
    }
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount <= 1) clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        return lastTimerCount <= 0 ? lastTimerCount : lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [disable]);

  return (
    <div className="flex flex-col bg-gray-100 gap-5">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white px-6 pt-10 pb-9 shadow-xl w-full max-w-lg rounded-2xl">
          <div className="flex flex-col space-y-16">
          
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-semibold text-[#33006F]">
                Email Verification
              </h1>
              <p className="text-sm font-medium text-[#33006F]">
                We have sent a code to your email{" "}
                <span className="font-medium">{email}</span>
              </p>
            </div>

          
            <form>
              <div className="space-y-8">
                <div className="flex items-center justify-between mx-auto w-full max-w-xs space-x-4">
                  {Array(4)
                    .fill(0)
                    .map((_, idx) => (
                      <input
                        key={idx}
                        maxLength="1"
                        className="w-16 h-16 text-center px-5 outline-none rounded-xl border border-gray-300 text-lg bg-gray-50 focus:bg-white focus:ring-2 ring-blue-500"
                        type="text"
                        value={OTPinput[idx]}
                        onChange={(e) => {
                          const updatedInput = [...OTPinput];
                          updatedInput[idx] = e.target.value;
                          setOTPinput(updatedInput);
                        }}
                      />
                    ))}
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => verifyOTP()}
                    className="w-full py-3 bg-[#33006F] text-white font-semibold text-sm rounded-lg hover:bg-[#662d91] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    Verify Account
                  </button>
                    <div className="text-center text-sm font-medium text-[#33006F]">
                    <p>Didn't receive code?</p>
                    <button
                      type="button"
                      className={`font-medium ${
                        disable
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#33006F] hover:underline"
                      }`}
                      onClick={() => resendOTP()}
                      disabled={disable}
                    >
                      {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OtpVerification;
