import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { showToast } from "../../toastConfig";


const OtpVerification = () => {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const navigate = useNavigate();

    const { email } = useParams();

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false; // Only numeric values
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        console.log("Submitted OTP:", otpValue);
        const payload = {otp: otpValue, email: email};

        try{
            const response = await axios.post("https://wvnu4myp6sfifxny3e3rbk3vte0yifdi.lambda-url.us-east-1.on.aws/",payload );
            console.log(response);
            const msg = response?.data?.message || "Successful!";
            showToast(msg, "success")
             navigate(`/`);
        }catch(err){
            //show error verified notification
            const msg = err?.response?.data?.message || "Something went wrong!!";
            showToast(msg, "error")
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-blue-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-center text-2xl font-bold text-blue-800 mb-4">Verify your account</h2>
                <p className="text-center text-sm mb-8">
                    Please enter the One-Time Password to verify your account
                    <br />
                    A One-Time Password has been sent to {email}
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center space-x-2 mb-6">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                name="otp"
                                maxLength="1"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onFocus={e => e.target.select()}
                                className="otp-input w-12 h-12 border-2 border-gray-300 text-center text-xl rounded focus:outline-none focus:border-blue-500"
                            />
                        ))}
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        Validate
                    </button>
                </form>
                <div className="flex flex-col items-center justify-center mt-4 text-blue-600 text-sm">
                    <button className="hover:text-blue-800" onClick={() => console.log('Resend OTP')}>Resend One-Time Password</button>
                    <button className="hover:text-blue-800" onClick={() => console.log('Change phone number')}>Entered a wrong email?</button>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;
