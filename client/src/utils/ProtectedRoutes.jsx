import React from 'react';
import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children, roles = [] }) {
    let user = null;

    try {
        const stored = localStorage.getItem('user');
        user = stored ? JSON.parse(stored) : null;
    } catch (e) {
        user = null;
    }

    // ❌ Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const userRole = user.role;

    // ❌ Role not allowed
    if (roles.length > 0 && !roles.includes(userRole)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoutes;
