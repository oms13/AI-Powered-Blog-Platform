import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('accessToken');
            let isValid;

            if (token) {
                try {
                    const response = await axios.get('http://localhost:5001/api/auth/verify',
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })

                    if (response.data.success) {
                        isValid = true;
                        setIsLoading(false);
                    }

                    if (isValid) {
                        setIsAuthenticated(true);
                        setUser(response.data.user);
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    console.error("Token verification failed:", error);
                    handleLogout();
                }finally{
                }
            }
            setIsLoading(false);
        };

        checkToken();
    }, []);

    const handleLogin = (token, userData) => {
        localStorage.setItem('accessToken', token);
        setIsAuthenticated(true);
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login: handleLogin, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};