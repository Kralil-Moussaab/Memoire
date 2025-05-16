import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export const AdminProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminToken = localStorage.getItem("token");

        if (adminToken) {
            setIsAuthenticated(true);
        }

        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

export const AdminLoginRedirect = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const adminToken = localStorage.getItem("token");

        if (adminToken) {
            setIsAuthenticated(true);
        }

        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    return isAuthenticated ? <Navigate to="/admin" replace /> : <Outlet />;
};