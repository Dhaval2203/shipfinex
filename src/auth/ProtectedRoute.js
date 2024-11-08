import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        // If not authenticated, redirect to the login page
        return <Navigate to='/login' />;
    }

    // Otherwise, render the protected route content
    return children;
}

export default ProtectedRoute;
