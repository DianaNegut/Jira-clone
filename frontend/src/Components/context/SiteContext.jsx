import {createContext, useState} from 'react';
export const SiteContext = createContext(null);

const SiteContextProvider = (props) => {
    const url = "http://localhost:4000"

    const [token, setToken] = useState("");

    const contextValue={
        url,
        token,
        setToken
    }



    return (
        <SiteContext.Provider value={contextValue}>
            {props.children}
        </SiteContext.Provider>
    )
    
}

export default SiteContextProvider;
