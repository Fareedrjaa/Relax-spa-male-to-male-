/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "../firebase";

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<User>;
  logOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser && currentUser.email) {
        // Sync user profile to Firestore `users/{userId}` as required by the blueprint
        const userPath = `users/${currentUser.uid}`;
        try {
          await setDoc(
            doc(db, "users", currentUser.uid),
            {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || "Bengaluru Gentleman",
              photoURL: currentUser.photoURL || "",
              createdAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (error) {
          console.error("Failed to sync user to Firestore:", error);
          // Conform to handling error guidelines
          handleFirestoreError(error, OperationType.WRITE, userPath);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Google sign-in popup error:", error);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out error:", error);
      throw error;
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, loading, signIn, logOut }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}
