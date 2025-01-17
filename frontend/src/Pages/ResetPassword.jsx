import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { email } = useAuth();

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const changePassword = (event) => {
    event.preventDefault();

    if (!validatePassword(formData.password)) {
      setErrorMessage(
        "Password must contain at least 8 characters, including a letter, a number, and a special character (!@#$%^&*)."
      );
      return;
    }

    axios
      .post("http://localhost:3001/resetpassword", {
        // Corrected the API endpoint
        email: email,
        newPassword: password,
      })
      .then((response) => {
        console.log("Password changed successfully:", response.data.message);
        alert("Password changed successfully!");
      })
      .catch((error) => {
        console.error(
          "Error changing password:",
          error.response?.data?.message || error.message
        );
        alert("Error changing password. Please try again.");
      });
  };

  return (
    <div>
      <form onSubmit={changePassword}>
        <input
          type="password" // Ensures secure input
          placeholder="Enter new password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required // Makes input required
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
