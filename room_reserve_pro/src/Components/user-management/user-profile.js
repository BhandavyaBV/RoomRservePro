import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showToast } from '../../toastConfig';

const UserProfile = ({ user }) => {

  const [userBookings, setUserBookings] = useState([]);
const [isLoaded, setIsLoaded] = useState(false);

  const [userData, setUserData] = useState({
    email: "",
    image: "",
    name: "",
    phoneNumber: "",
    universityId: "",
    courseDescription: "",
  });
  const [editing, setEditing] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(user?.image || '');
  const currentUserDetails = JSON.parse(localStorage.getItem('user'));


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleEditToggle = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const fetchUserImageFromLocalStorage = () => {
  const userString = localStorage.getItem('user');

  if (userString) {
    const userObject = JSON.parse(userString);

    if (userObject.image) {
      setImagePreviewUrl(userObject.image);
    } 
  }
};

  

  const fetchUserProfile = async () => {
    try {
      const response = await axios.post('https://4b7uyf7ncsr2ssooxwpsjwyv7m0jlxue.lambda-url.us-east-1.on.aws/', {
        email: currentUserDetails.email
      });
      console.log(response);
      setUserData(response?.data[0]);
      // setImagePreviewUrl(response.data.image); // Update image preview if image data is included
      fetchUserImageFromLocalStorage()
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Handle error appropriately
    }
  };

    const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result); // Update the state with the new image preview URL
        setUserData({ ...userData, image: reader.result }); // Update the user data with the new base64 string
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  };

  useEffect(() => {
     fetchUserProfile(); 
     fetchUserBookings();
  }, []);
  
const fetchUserBookings = async () => {
  setIsLoaded(false);
  try {
    const response = await axios.post('https://iwlk4rhq7n5aqgqj72qakbv4tu0hokch.lambda-url.us-east-1.on.aws/', {
      email: currentUserDetails.email
    });
    console.log("Booking response data:", response.data);

    console.log(response);
    // Map the response to your desired format
    const bookings = response.data.map(booking => ({
      roomName: booking.roomDetails.room_name,
      location: booking.roomDetails.location,
      startTime: booking.start_date_time,
      endTime: booking.end_date_time,
      status: booking.status,
      bookingId: booking.bookingId,
    }));

    setUserBookings(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
  } finally {
    setIsLoaded(true);
  }
};

  const handleUpdateUserInfo = async (event) => {
    event.preventDefault();
    try {
      console.log(userData);
      const payload = {
        ...userData,
        image: "",
      };
      console.log(payload);
      const response = await axios.post('https://noz7kh5xv3s4cbphawkwphudeq0jwwya.lambda-url.us-east-1.on.aws/', payload);
      showToast("Details Updated Successfully", "success")
      // Retrieve the user item from localStorage
        const userString = localStorage.getItem('user');

        if (userString) {
          // Parse the string to get the user object
          const userObject = JSON.parse(userString);

          // Update the image key
          userObject.image = imagePreviewUrl;

          // Convert the updated object back to a string
          const updatedUserString = JSON.stringify(userObject);

          // Store the updated string in localStorage
          localStorage.setItem('user', updatedUserString);
        }
      //   console.log('Profile updated:', response.data);
      setEditing(false);
      // fetchUserProfile(); // Re-fetch user profile to display updated data
    } catch (error) {
      showToast("Details failed to get updated", "error");
      console.error('Error updating user profile:', error);
      // Handle error appropriately
    }
  };

  const handleDeleteClick = (bookingId) => async (event) => {
    event.preventDefault(); // Prevent the default action
    console.log("Attempting to delete booking with ID:", bookingId);
    try {
      const response = await axios.post('https://tocle65m72fezwy23zgoqiuou40etrmq.lambda-url.us-east-1.on.aws/', {
        booking_id: bookingId // Make sure this matches the expected key on your backend
      });
  
      if (response.status === 200) {
        // Assuming the response is successful, remove the booking from the list
        const updatedBookings = userBookings.filter(booking => booking.bookingId !== bookingId);
        setUserBookings(updatedBookings);
        showToast("Booking deleted successfully", "success");
      } else {
        // Handle any unsuccessful response here
        showToast("Failed to delete booking", "error");
      }
    } catch (error) {
      console.error('Error deleting the booking:', error);
      showToast("Failed to delete booking", "error");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center px-4 flex flex-col">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-4xl w-full mx-auto">
        {/* Profile header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-blue-800 mb-3">User Profile</h2>
          <div className="border-b-2 border-blue-200"></div>
        </div>

        {/* Profile content */}
        <div className="flex flex-wrap md:flex-nowrap gap-10 justify-center md:justify-start">
       {/* Profile Image */}
        <div className="w-full md:w-1/3">
          <img 
            src={imagePreviewUrl || '/path-to-default-user-photo.jpg'} 
            alt="User" 
            className="rounded-full object-cover mb-4 border-4 border-blue-200" 
            style={{ width: '150px', height: '150px' }} 
          />
          {editing && (
            <input
              type="file"
              name="profileImage"
              onChange={handleImageChange}
              className="block w-full text-sm text-blue-800 bg-blue-100 border border-blue-300 rounded cursor-pointer p-2"
            />
          )}
        </div>

          {/* User Info and Edit Form */}
          <div className="w-full md:w-2/3">
            <form onSubmit={handleUpdateUserInfo} className="space-y-4">
              {/* Name and other fields */}
                    <div className="space-y-2">
                    {editing ? (
                        <div className="flex gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={userData.name}
                            onChange={handleInputChange}
                            className="w-1/2 p-2 border border-blue-500 rounded"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={userData.email}
                            disabled // Email field is always disabled
                            className="w-1/2 p-2 border border-gray-300 rounded bg-gray-100 text-gray-500"
                        />
                        </div>
                    ) : (
                        <p className="text-gray-700">
                        Name: <span className="text-gray-900 font-semibold">{userData.name}</span>
                        </p>
                    )}

                {/* Phone Number */}
                {editing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={userData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-blue-500 rounded"
                  />
                ) : (
                  <p className="text-gray-700">
                    Phone Number: <span className="text-gray-900 font-semibold">{userData.phoneNumber}</span>
                  </p>
                )}

                {/* Course Description */}
                {editing ? (
                  <>
                    <textarea
                      name="courseDescription"
                      placeholder="Course Description"
                      value={userData.courseDescription}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-blue-500 rounded"
                      rows="4"
                    />
                  </>
                ) : (
                  <p className="text-gray-700">
                    Course Description: <span className="text-gray-900 font-semibold">{userData.courseDescription}</span>
                  </p>
                )}

                {/* Banner Id */}
                {editing ? (
                      <input
                        type="text"
                        name="universityId"
                        placeholder="Banner Id"
                        onChange={handleInputChange}
                        value={`B00${userData.universityId || ''}`}
                        disabled
                        className="w-full p-2 border border-blue-500 rounded"
                      />
                    ) : (
                      <p className="text-gray-700">
                        Banner ID: <span className="text-gray-900 font-semibold">{`B00${userData.universityId}`}</span>
                      </p>
                    )}

              </div>

              {/* Edit, Save, and Cancel Buttons */}
              {editing ? (
                <>
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
                    Save Changes
                  </button>
                  <button type="button" onClick={handleCancelEdit} className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200 ml-4">
                    Cancel
                  </button>
                </>
              ) : (
                <button type="button" onClick={handleEditToggle} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200">
                  Edit Profile
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      {/* Booking History Card */}
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-4xl w-full mx-auto mt-2">
        <h2 className="text-3xl font-bold text-blue-800 mb-3">Booking History</h2>
        <div className="border-b-2 border-blue-200 mb-4"></div>
        {/* Inside the return statement of the UserProfile component */}
{isLoaded && userBookings.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="min-w-full leading-normal">
      <thead>
        <tr>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Room Name
          </th>
          {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Location
          </th> */}
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Start Time
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            End Time
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Status
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {userBookings.map((booking, index) => (
          <tr key={index}>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {booking.roomName}
            </td>
            {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {booking.location}
            </td> */}
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {new Date(booking.startTime).toLocaleString()}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {new Date(booking.endTime).toLocaleString()}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {booking.status}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
               <a href="#" className="text-blue-600 hover:text-blue-800" onClick={handleDeleteClick(booking.bookingId)}>
                  Delete {/* Optional: Add icon here */}
               </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (<p>No Booking History Available</p>)}

      </div>
    </div>
  );
};

export default UserProfile;
