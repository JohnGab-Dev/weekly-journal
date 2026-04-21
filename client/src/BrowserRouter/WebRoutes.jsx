import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import React from 'react'

// pages
import HomePage from "@/pages/homePage"
//auth
import LoginPage from "@/pages/Auth/login";
import SignupPage from "@/pages/Auth/signup"

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


//notfound
import NotFound from "@/pages/notfound"
function WebRoutes() {

  return (
    <div>
      <Router>
        <Routes>
            <Route path="/" element={<HomePage />} /> 

            <Route path="/login" element={<LoginPage />} /> 
            <Route path="/signup" element={<SignupPage />} /> 

            <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} /> 
            <Route path="/users" element={<ProtectedRoutes><UsersPage /></ProtectedRoutes>} /> 
            <Route path="/user-logs" element={<ProtectedRoutes><UserLogs /></ProtectedRoutes>} /> 
            <Route path="/events" element={<ProtectedRoutes><Events /></ProtectedRoutes>} /> 
            <Route path="/account-settings" element={<ProtectedRoutes><Account /></ProtectedRoutes>} /> 
            <Route path="/bin" element={<ProtectedRoutes><Bin /></ProtectedRoutes>} />


            {/* users */}
            <Route path="/home" element={<ProtectedRoutes><UserPage /></ProtectedRoutes>} /> 

            <Route path="*" element={<NotFound />} /> 
        </Routes>
      </Router>
    </div>
  )
}

export default WebRoutes
