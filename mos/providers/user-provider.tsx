"use client";

import { UserDTO } from "@/data-acess/DAO/userDAO";
import React, { createContext, useContext } from "react";

interface UserContextType {
  user: UserDTO;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  user,
  children,
}: {
  user: UserDTO;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
