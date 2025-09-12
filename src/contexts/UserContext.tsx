import { LoaderCircle } from "@/components/loader/loadingCircle";
import { LoginScreen } from "@/pages/LoginScreen";
import { UserContextType, User } from "@/types";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserState(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const setUser = (userData: User) => {
    setUserState(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem("user");
  };

  const hasProfile = user !== null && user.name.trim() !== "" && user.email.trim() !== "";

  const getAvatar = () => {
    if (!user) return "";
    if (user.photo && user.photo.trim() !== "") {
      return user.photo;
    }
    return user.name.charAt(0).toUpperCase();
  };

  // 🔄 Enquanto carrega o localStorage → mostra loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle /> {/* seu spinner ou texto tipo "Carregando..." */}
      </div>
    );
  }

  // 🔑 Se não tem perfil → mostra login
  if (!hasProfile) {
    return <LoginScreen onLogin={setUser} />;
  }

  // ✅ Se logado → libera app
  return (
    <UserContext.Provider value={{ user, setUser, clearUser, hasProfile, getAvatar }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
