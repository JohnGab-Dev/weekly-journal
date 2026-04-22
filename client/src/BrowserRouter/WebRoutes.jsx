import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import React from 'react'

// pages
import HomePage from "@/pages/homePage"
//auth
import LoginPage from "@/pages/Auth/login";
import SignupPage from "@/pages/Auth/signup"
import VerifyEmail from "@/pages/Auth/VerifyEmail"
import VerifyOtp from "@/pages/Auth/VerifyOtp"
import ChangePass from "@/pages/Auth/Cpass"

//admin
import Dashboard from "@/pages/admin/dashboard"
import UsersPage from "@/pages/admin/users"
import UserLogs from "@/pages/admin/logs"
import Events from "@/pages/admin/events"
import Account from "@/pages/admin/account"
import Bin from "@/pages/admin/bin"

//user
import UserPage from "@/pages/user/home";

//route protection
import ProtectedRoutes from "@/utils/ProtectedRoutes";
import AuthRoutes from "@/utils/AuthRoutes";


//notfound
import NotFound from "@/pages/notfound"
function WebRoutes() {

  return (
    <div>
      <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={<AuthRoutes><LoginPage /></AuthRoutes>} /> 
            <Route path="/signup" element={<AuthRoutes><SignupPage /></AuthRoutes>} /> 
            <Route path="/email-verify" element={<AuthRoutes><VerifyEmail /></AuthRoutes>} />
            <Route path="/verify-otp" element={<AuthRoutes><VerifyOtp /></AuthRoutes>} />
            <Route path="/change-password" element={<AuthRoutes><ChangePass /></AuthRoutes>} />

            <Route path="/dashboard" element={<ProtectedRoutes roles={['admin']}><Dashboard /></ProtectedRoutes>} /> 
            <Route path="/users" element={<ProtectedRoutes roles={['admin']}><UsersPage /></ProtectedRoutes>} /> 
            <Route path="/user-logs" element={<ProtectedRoutes roles={['admin']}><UserLogs /></ProtectedRoutes>} /> 
            <Route path="/events" element={<ProtectedRoutes roles={['admin']}><Events /></ProtectedRoutes>} /> 
            <Route path="/account-settings" element={<ProtectedRoutes roles={['admin']}><Account /></ProtectedRoutes>} /> 
            <Route path="/bin" element={<ProtectedRoutes roles={['admin']}><Bin /></ProtectedRoutes>} />


            {/* users */}
            <Route path="/home" element={<ProtectedRoutes roles={['employee', 'student']}><UserPage /></ProtectedRoutes>} /> 

            <Route path="*" element={<NotFound />} /> 
        </Routes>
      </Router>
    </div>
  )
}

export default WebRoutes
