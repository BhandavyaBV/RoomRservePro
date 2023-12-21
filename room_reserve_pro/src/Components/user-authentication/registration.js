import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { showToast } from "../../toastConfig";



const Registration = () => {
  const navigate = useNavigate();
  // State for other form inputs
  const [name, setName] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // State for image
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Function to validate email
  // Function to validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^@]+@dal\.ca$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Email must be in the form of @dal.ca' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: null }));
    return true;
  };

  // Function to validate phone number
  const validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber.length !== 10) {
      setErrors(prev => ({ ...prev, phoneNumber: 'Phone number must be 10 digits' }));
      return false;
    }
    setErrors(prev => ({ ...prev, phoneNumber: null }));
    return true;
  };

  // Function to validate password
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters, including 1 alphabet, 1 special character, and numbers' }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: null }));
    return true;
  };

  // Handle image change
  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // This will be the base64 string
      setPreview(URL.createObjectURL(file));
    };
    reader.readAsDataURL(file);
  }
  console.log(image);
};


  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);

      if (password !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        showToast("Passwords do not match", "error");
        return;
    } else {
        setErrors(prev => ({ ...prev, confirmPassword: null }));
    }

    if (!isEmailValid || !isPasswordValid || !isPhoneNumberValid) {
      // You can show an error message or toast notification here
      showToast("Please fix form errors", "error")
      return; // Prevent form submission if validation fails
    }

    const payload = {
        userId: uuidv4().toString(),
        name: name,
        universityId: universityId,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        image: image, // Assuming this is the base64 encoded string of the image
        isVerified: false,
        otp: null,
        isBanned: false,
      };

      console.log(payload);
    try{
        const response = await axios.post("https://gp53ihaoo42u5jdmv6zrl2h7mm0igdmz.lambda-url.us-east-1.on.aws/",payload );//currentUserEmail
        console.log(response);
        const msg = response?.data?.message || "Successful!";
        showToast(msg, "success")
        //show Notification "User Registered Successfully!!"
        navigate(`/otp/${email}`);
    }

    catch(err) {
        console.log(err);
        const msg = err?.response?.data?.message || "Something went wrong!!";
        showToast(msg, "error")
        //Notification of Something went wrong
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-4xl w-full space-y-8 p-10 bg-white shadow-xl rounded-xl">
        <div className="flex flex-col md:flex-row">
         <div className="md:w-1/2 bg-blue-600 rounded-xl p-5 text-white space-y-5">
          <h2 className="text-3xl font-bold mb-3">Join Our Library Community</h2>
          <p className="text-lg">
            Become a member of the premier literary hub today and unlock the door to a world of knowledge. Sign up and embark on your reading adventure!
          </p>
          <p className="text-lg">
            With thousands of books, journals, and articles at your fingertips, your love for reading and learning will grow boundlessly. Register now and let the stories unfold.
          </p>
        </div>

          <div className="md:w-1/2 space-y-6 p-5">
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="full-name" className="text-sm font-semibold">User name</label>
                <input id="full-name" name="name" type="text" required
                       className="w-full p-2 border border-gray-300 rounded mt-1"
                       placeholder="Full name" value={name}
                       onChange={(e) => setName(e.target.value)} />
                       {/* Display name error here (if any) */}
                      {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
     
              </div>
              <div className="w-1/2">
                <label htmlFor="email-address" className="text-sm font-semibold">Email</label>
                <input id="email-address" name="email" type="email" autoComplete="email" required
                       className="w-full p-2 border border-gray-300 rounded mt-1"
                       placeholder="Email address" value={email}
                       onChange={(e) => setEmail(e.target.value)} />
                       {/* Display email error here */}
                       {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="phonenumber" className="text-sm font-semibold">Contact Number</label>
                <input id="phonenumber" name="phonenumber" type="number" required
                       className="w-full p-2 border border-gray-300 rounded mt-1"
                       placeholder="Phone Number" value={phoneNumber}
                       onChange={(e) => setPhoneNumber(e.target.value)} />
                       {/* Display phone number error here */}
                     {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}                       
              </div>
            <div className="w-1/2">
              <label htmlFor="university-id" className="block text-sm font-semibold mb-2">Banner Id</label>
              <div className="flex">
                <span className="flex items-center bg-gray-200 border border-r-0 border-gray-300 px-3 rounded-l-md">
                  B00
                </span>
                <input
                  id="university-id"
                  name="universityId"
                  type="text"
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="1234567"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                />
              </div>
            </div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="password" className="text-sm font-semibold">Password</label>
                <input id="password" name="password" type="password" autoComplete="new-password" required
                       className="w-full p-2 border border-gray-300 rounded mt-1"
                       placeholder="Password" value={password}
                       onChange={(e) => setPassword(e.target.value)} />
                       {/* Display password error here */}
                      {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
        
              </div>
              <div className="w-1/2">
                <label htmlFor="confirmpassword" className="text-sm font-semibold">Confirm Password</label>
                <input id="confirmpassword" name="confirmpassword" type="password" autoComplete="new-password" required
                       className="w-full p-2 border border-gray-300 rounded mt-1"
                       placeholder="Confirm Password" value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)} />
                       {/* Display confirm password error here */}
                 {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}

              </div>
            </div>

            <div className="flex justify-between">
              <button type="button"
                      className="px-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100">
                Cancel
              </button>
              <button type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={handleSubmit}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
