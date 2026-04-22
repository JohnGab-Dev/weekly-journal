import React from 'react'
import { Navigate } from "react-router-dom";

function AuthRoutes({ children }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role;

    if (role === 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    if (role === 'student' || role === 'employee') {
        return <Navigate to="/home" replace />;
    }

    return children;
}
export default AuthRoutes