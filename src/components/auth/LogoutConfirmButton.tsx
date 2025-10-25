"use client";

import { ReactNode } from "react";
import { useAuth } from "./AuthProvider";

interface LogoutConfirmButtonProps {
  className?: string;
  children?: ReactNode;
}

export const LogoutConfirmButton = ({
  className = "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors",
  children = "Logout",
}: LogoutConfirmButtonProps) => {
  const { logout } = useAuth();

  return (
    <button onClick={logout} className={className}>
      {children}
    </button>
  );
};
