import {createContext} from 'react';
export const SiteContext = createContext(null);

const SiteContextProvider = (props) => {
    const contextValue = {
        
    }

    return (
        <SiteContext.Provider value={contextValue}>
            {props.children}
        </SiteContext.Provider>
    )
}

export default SiteContextProvider;
