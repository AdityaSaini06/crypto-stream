import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Create authentication context
const AuthContext = createContext();

// Custom hook to use authentication context
export function useAuth() {
    return useContext(AuthContext);
}

// Provides authentication state and functions to children
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen for auth state changes (login/logout)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Expose currentUser and signOut function
    const value = {
        currentUser,
        signOut: () => signOut(auth),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
