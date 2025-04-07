import React, { createContext, useState } from 'react';

export const SiteContext = createContext();

export const SiteContextProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userRole, setUserRole] = useState(null); // Add user role state
    const url = "http://localhost:4000"; // Your API base URL
    
    return (
        <SiteContext.Provider 
            value={{ 
                token, 
                setToken, 
                url,
                userRole,
                setUserRole // Make sure to provide the setUserRole function
            }}
        >
            {children}
        </SiteContext.Provider>
    );
};

export default SiteContextProvider;