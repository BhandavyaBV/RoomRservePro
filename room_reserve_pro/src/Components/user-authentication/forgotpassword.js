import React, { useState } from 'react';
import axios from 'axios';
import { showToast } from "../../toastConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

   const validateEmail = (email) => {
    const emailRegex = /^[^@]+@dal\.ca$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Email must be in the form of @dal.ca' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: null }));
    return true;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          'Password must be at least 8 characters, including 1 alphabet, 1 special character, and numbers',
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: '' }));
    return true;
  };

  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords don't match",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    return true;
  };

  const handleResetPassword = async(e) => {
    e.preventDefault();
    // Validate email, password, and confirm password here
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword();

   if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
    try {
      // Handle the password reset logic here
      console.log('Reset password for:', email);
      const payload = {
        email: email,
        password: password
      };
      // Call the API endpoint to reset the password
      const response = await axios.post("https://zl5mlf2mjeo2vthoavhthsbgya0tnexz.lambda-url.us-east-1.on.aws/", payload);
       const msg = response?.data?.message || "Successful!";
        showToast(msg, "success")
      // If the response is successful, handle the next steps (e.g., show a confirmation message)
      console.log(response.data);
      // Add your logic for a successful password reset
    } catch (error) {
         const msg = error?.response?.data?.message || "Something went wrong!!";
        showToast(msg, "error")
      // Handle the error appropriately
      console.error('Error resetting password:', error);
      // Add your logic for handling errors (e.g., showing an error message to the user)
    }
  } else {
    // Handle the case where validation fails
    console.error('Validation failed');
    
    // Add your logic for handling validation failures
  }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl text-center font-bold mb-8">RoomReservePro</h2>
        <h3 className="text-xl text-center font-semibold mb-4">Reset your password</h3>
        <p className="text-gray-600 text-center mb-8">
          Enter your email and password to reset.
        </p>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
             Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
