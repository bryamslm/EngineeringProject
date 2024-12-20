import React, { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";


/* Creating a context object. */
export const authContext = createContext();

/**
 * UseAuth() is a function that returns the context object that was created by the useContext() hook.
 */
export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    console.log("error creating auth context");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState("");

  /* is called when the component is updated. */

  useEffect(() => {
    const subscribed = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        console.log("User isn't logged in");
        setUser("");
      } else {
        setUser(currentUser);
        localStorage.setItem("currentUser", currentUser.email);
      }
    });
    return () => subscribed();
  }, []);

  const register = async (email, password) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithGoogle = async () => {
    const responseGoogle = new GoogleAuthProvider();
    responseGoogle.setCustomParameters({ prompt: 'select_account' });
    try {
      const response = await signInWithPopup(auth, responseGoogle);
      console.log("response login google", response);
      return response;

    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    try {
      const response = await signOut(auth);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <authContext.Provider
      value={{
        register,
        login,
        loginWithGoogle,
        logout,
        user,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
