import { createContext, useContext, useEffect, useState } from "react"

const LoggedIn = createContext();

const LoggedInProvider = ({ children }) => {

    const [isLoggedIn, setisLoggedIn] = useState(() => {
        const storedLog = localStorage.getItem('log');
        return storedLog ? JSON.parse(storedLog) : false;
    });

    useEffect(() => {
        localStorage.setItem('log', JSON.stringify(isLoggedIn));
    },[isLoggedIn]);

    const value = {
        isLoggedIn,
        setisLoggedIn
    };

    return (
        <LoggedIn.Provider value={value}>
            {children}
        </LoggedIn.Provider>
    )
}



export const LoggedState = () => {
    return useContext(LoggedIn); //Custom Hook Type
};

export default LoggedInProvider;

