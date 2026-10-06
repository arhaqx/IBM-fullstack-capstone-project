import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AuthProvider = ({ children }) => {
  // Restore the session (if any) so a page refresh keeps the user logged in
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!sessionStorage.getItem('auth-token'));
  const [userName, setUserName] = useState(() => sessionStorage.getItem('name') || "");

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, userName, setUserName }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
