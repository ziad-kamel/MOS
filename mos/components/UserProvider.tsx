// components/UserProvider.tsx ("use client")
"use client";
import { UserModelType } from "@/utils/types";
import { User } from "@supabase/supabase-js";
import { createContext, useContext, ReactNode, useState } from "react";

type authUser = { supaUser: User; dbUser: UserModelType } | null;

const UserContext = createContext<{
  user: {supaUser?:User,dbUser?:UserModelType}
  setUser: ({supaUser,dbUser}:{supaUser:User,dbUser:UserModelType}) => void;
} | null>(null);

export default function UserProvider({
  children,
  supaUser,
  dbUser
}: {
  children: ReactNode;
  supaUser?: User;
  dbUser?:UserModelType
}) {
  const [user, setUser] = useState({supaUser,dbUser});

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}
