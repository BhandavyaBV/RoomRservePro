// src/Components/Login.js
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { showToast } from '../../toastConfig';

const Login = () => {
  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const navigate = useNavigate();

  const handleRegisterClick = () => {
    // Navigate to the register route
    navigate('/register');
  };

  const handleAdminClick = () => {
    // Navigate to the register route
    navigate('/admin/login');
  }

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleForgotPasswordClick = () => {
    navigate('/forgot-password'); // Use the correct path for your route
  };

  // Handle form submit
  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevents the default form submit action
    console.log("Email:", email, "Password:", password);
     const payload = {
      email: email,
      password: password
  };

  console.log(payload);
    try{
        const response = await axios.post("https://mopha46myd2vkrcaawkvzwb3xy0hqfix.lambda-url.us-east-1.on.aws/",payload);//currentUserEmail
        console.log("User",response);
        const userDetails = response.data.userDetails;
        localStorage.setItem("user",JSON.stringify(userDetails));
        console.log(userDetails);
        showToast("Login successful", "success");
        navigate(`/roombooking`);

    }
    catch(err) {
        console.log(err);
        const msg = err?.response?.data?.message || "Something went wrong!!";
        showToast(msg, "error")
    }
    // Add your login logic here
  };

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample"
        />
      </div>
      <div className="md:w-1/3 max-w-sm">
        <form onSubmit={handleSubmit}>
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded "
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <div className="mt-4 flex justify-between font-semibold text-sm">
            <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
              <input className="mr-1" type="checkbox" />
              <span>Remember Me</span>
            </label>
            <button
              onClick={handleForgotPasswordClick}
              className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-4"
            >
              Forgot Password?
            </button>
          </div>
          <div className="text-center md:text-left">
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
              type="submit"
            >
              Login
            </button>
          </div>
          <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
            Don&apos;t have an account?{" "}
            <button
        onClick={handleRegisterClick}
        className="text-red-600 hover:underline hover:underline-offset-4"
      >
        Register
      </button>
          </div>
          <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
            Are you admin? {" "}
            <button
        onClick={handleAdminClick}
        className="text-red-600 hover:underline hover:underline-offset-4"
      >
        Login
      </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
