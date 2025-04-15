import React, { createContext, useState } from 'react';

export const SiteContext = createContext();

export const SiteContextProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userRole, setUserRole] = useState(null); 
    const url = "http://localhost:4000"; 
    
    return (
        <SiteContext.Provider 
            value={{ 
                token, 
                setToken, 
                url,
                userRole,
                setUserRole 
            }}
        >
            {children}
        </SiteContext.Provider>
    );
};

export default SiteContextProvider;