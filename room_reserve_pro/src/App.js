import "./App.css";
import React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Amplify } from 'aws-amplify';
// import awsmobile from './aws-exports';

import Login from "./Components/user-authentication/login";
import Registration from "./Components/user-authentication/registration";
import OtpVerification from "./Components/user-authentication/otp";
import UserProfile from "./Components/user-management/user-profile";
import NavbarComponent from "./Components/Navbar/Navbar";
import Feedback from "./Components/Feedback/FeedbackComponent";
import SpotBooking from "./Components/SpotBooking/SpotBooking";
import RoomBooking from "./Components/room-booking/roombooking";
import AdminLogin from "./Components/Admin/AdminLogin/AdminLogin";
import AdminDashboard from "./Components/Admin/Dashboard/Dashboard";
import AdminUserManagement from "./Components/Admin/UserManagement/UserManagement";
import AdminRoomManagmenet from "./Components/Admin/AdminRoomManagement/AdminRoomManagement";
import AdminBookingsManagement from "./Components/Admin/AdminBookingsManagement/AdminBookingsManagement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./Components/user-authentication/forgotpassword";
import AdminContextProvider from "./contexts/AdminProvider";
import AdminFeedbacks from "./Components/Admin/AdminFeedbacks/AdminFeedbacks";

const queryClient = new QueryClient();

// Amplify.configure(awsmobile);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Same as */}
      <ToastContainer />
      <AdminContextProvider>
        <BrowserRouter>
          <div>
            <NavbarComponent />
          </div>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/register" element={<Registration />} />
            <Route exact path="/otp/:email" element={<OtpVerification />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/user-profile" element={<UserProfile />} />
            <Route exact path="/feedback" element={<Feedback />} />
            <Route exact path="/spot-booking" element={<SpotBooking />} />
            <Route exact path="/roombooking" element={<RoomBooking />} />
            <Route path="/admin">
              <Route path="login" element={<AdminLogin />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUserManagement />} />
              <Route path="rooms" element={<AdminRoomManagmenet />} />
              <Route path="bookings" element={<AdminBookingsManagement />} />
              <Route path="feedbacks" element={<AdminFeedbacks />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminContextProvider>
    </QueryClientProvider>
  );
}

export default App;
