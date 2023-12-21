import React from 'react';

export const adminContext = React.createContext()
const AdminContextProvider = ({children}) => {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState(false);
    const login = (email, password) => {
        if(email === 'admin@dal.ca' && password === 'admin') {
            setIsAdminLoggedIn(true);
            return true;
        }else{
            setIsAdminLoggedIn(false);
            return false;
        }
    }
    const logout = () => {
        setIsAdminLoggedIn(false);
        window.location.href = '/admin/login';
    }
    const redirectIfNotLoggedIn = () => {
        if(!isAdminLoggedIn) {
            window.location.href = '/admin/login';
        }
    }
  return (
    <adminContext.Provider value={{
        isAdminLoggedIn,
        login,
        logout,
        redirectIfNotLoggedIn
    }}>{children}</adminContext.Provider>
  )
}

export default AdminContextProvider