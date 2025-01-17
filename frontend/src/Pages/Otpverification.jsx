import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const OtpVerification = () => {
  const { email } = useAuth();
  const [otp, setOtp] = useState();
  const [disable, setDisable] = useState(true);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [timerCount, setTimer] = useState(60);

  // Generate OTP function
  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  }

  const navigate = useNavigate();

  const resendOTP = () => {

    if (!disable) return;
  
    const newOTP = generateOTP();
    setOtp(newOTP);
    console.log("Generated OTP:", newOTP);
  
    axios
      .post("http://localhost:3001/send_recovery_email", {
        recipient_email: email,
        OTP: newOTP,
      })
      .then((result) => {
        console.log("Email sent response:", result);
        setDisable(true);
        toast.success("A new OTP has been sent to your email.");
      })
      .catch((error) => {
        console.error("Error in OTP request:", error);
        toast.error("Failed to send OTP. Please try again.");
      });
  };
  

  const verifyOTP = () => {
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
    <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
      <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email {email}</p>
            </div>
          </div>

          <div>
            <form>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  {Array(4)
                    .fill(0)
                    .map((_, idx) => (
                      <div key={idx} className="w-16 h-16">
                        <input
                          maxLength="1"
                          className="w-full h-full text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                          type="text"
                          value={OTPinput[idx]}
                          onChange={(e) => {
                            const updatedInput = [...OTPinput];
                            updatedInput[idx] = e.target.value;
                            setOTPinput(updatedInput);
                          }}
                        />
                      </div>
                    ))}
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <a
                      onClick={() => verifyOTP()}
                      className="cursor-pointer flex flex-row items-center justify-center w-full border rounded-xl py-5 bg-blue-700 text-white text-sm shadow-sm"
                    >
                      Verify Account
                    </a>
                  </div>

                  <div className="flex flex-row items-center justify-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Didn't receive code?</p>
                    <a
                      className="cursor-pointer"
                      style={{
                        color: disable ? "gray" : "blue",
                        cursor: disable ? "none" : "pointer",
                        textDecoration: disable ? "none" : "underline",
                      }}
                      onClick={() => resendOTP()}
                    >
                      {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
