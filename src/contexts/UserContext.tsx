import { LoaderCircle } from "@/components/loader/loadingCircle";
import { auth, signInWithGoogle } from "@/config/firebase";
import { LoginScreen } from "@/pages/LoginScreen";
import { UserContextType, User } from "@/types";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔄 Observa mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          photo: firebaseUser.photoURL || "",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearUser = async () => {
    await signOut(auth);
    setUser(null);
  };

  const hasProfile =
    user !== null && user.name.trim() !== "" && user.email.trim() !== "";

  const getAvatar = () => {
    if (!user) return "";
    if (user.photo && user.photo.trim() !== "") {
      return user.photo;
    }
    return user.name.charAt(0).toUpperCase();
  };

  // 🔄 Enquanto verifica se tem sessão → loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle />
      </div>
    );
  }

  // 🔑 Se não tem perfil → tela de login
  if (!hasProfile) {
    return (
      <LoginScreen
        onEmailLogin={(email, name) => {
          setUser({ email, name, photo: "" });
        }}
        onGoogleLogin={async () => {
          try {
            const googleUser = await signInWithGoogle();
            setUser(googleUser);
          } catch (err) {
            console.error("Erro no login com Google:", err);
          }
        }}
      />
    );
  }

  // ✅ Se logado → libera app
  return (
    <UserContext.Provider
      value={{ user, setUser, clearUser, hasProfile, getAvatar }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
