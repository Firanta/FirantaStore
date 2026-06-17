import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "superadmin";
  name?: string;
  createdAt: string;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isDev = import.meta.env.DEV;
    
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (!firebaseUser) {
          setAdminUser(null);
          setIsLoading(false);
          if (isDev) console.log("[AdminContext] No user authenticated");
          return;
        }

        try {
          if (isDev) console.log("[AdminContext] Checking admin status for uid:", firebaseUser.uid);
          
          // Get token claims with refresh
          const idTokenResult = await firebaseUser.getIdTokenResult(true);
          
          // Check if admin via custom claims or specific UID - PRIMARY METHOD
          const isAdminUid = firebaseUser.uid === "tVTJBnI0mrSp0hMK4KNrooHbdLE3";
          const isAdminFromClaims = idTokenResult.claims.isAdmin === true || isAdminUid;
          
          if (isDev) console.log("[AdminContext] Custom claims check:", { 
            isAdmin: isAdminFromClaims, 
            uid: firebaseUser.uid,
            allClaims: idTokenResult.claims 
          });

          if (isAdminFromClaims) {
            // User is admin based on custom claims - PREFERRED METHOD
            setAdminUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              role: "admin",
              name: firebaseUser.displayName || "",
              createdAt: new Date().toISOString(),
            });
            if (isDev) console.log("[AdminContext] ✅ Admin authenticated via custom claims");
            setIsLoading(false);
            return;
          }

          if (isDev) console.log("[AdminContext] No custom claims found, checking Firestore (fallback)...");

          // Try to fetch admin document from Firestore (FALLBACK ONLY)
          try {
            const adminDocRef = doc(db, "admins", firebaseUser.uid);
            const adminDocSnap = await getDoc(adminDocRef);

            if (adminDocSnap.exists()) {
              const adminData = adminDocSnap.data();
              setAdminUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || "",
                role: adminData.role || "admin",
                name: adminData.name || firebaseUser.displayName || "",
                createdAt: adminData.createdAt || new Date().toISOString(),
              });
              if (isDev) console.log("[AdminContext] ✅ Admin authenticated via Firestore document");
            } else {
              if (isDev) console.log("[AdminContext] ❌ No admin document found in Firestore and no custom claims");
              setAdminUser(null);
            }
          } catch (firestoreError: any) {
            console.warn("[AdminContext] ⚠️ Firestore check failed (permission or path issue):", firestoreError.code || firestoreError.message);
            
            // Don't block if Firestore fails - custom claims are primary
            if (isAdminFromClaims) {
              setAdminUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || "",
                role: "admin",
                name: firebaseUser.displayName || "",
                createdAt: new Date().toISOString(),
              });
              if (isDev) console.log("[AdminContext] ✅ Admin via custom claims (Firestore check skipped)");
            } else {
              if (isDev) console.log("[AdminContext] ❌ Not admin - no custom claims and Firestore unavailable");
              setAdminUser(null);
            }
          }
        } catch (error) {
          console.error("[AdminContext] ❌ Unexpected error checking admin status:", error);
          setAdminUser(null);
        } finally {
          setIsLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setAdminUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated: !!adminUser,
        isLoading,
        isAdmin: !!adminUser && (adminUser.role === "admin" || adminUser.role === "superadmin"),
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};
