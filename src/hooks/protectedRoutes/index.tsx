import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useAuth } from "../auth";

export const ProtectRoutes: React.FC = () => {
  const { cookies, logout } = useAuth();

  useEffect(() => {
    try {
      if (cookies) {
        const token = cookies.authmaira;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwt_decode(token);
        if (decoded) {
          const { roles, username, email } = decoded;
          if (!username || !email || !roles || !roles.length || roles.length <= 0) {
            logout();
          } else {
            const rolesArr = [];

            for (let i = 0; i < roles.length; i++) {
              rolesArr.push(roles[i].name);
            }
            if (!rolesArr.includes("admin")) {
              logout();
            }
          }
        }
      }
    } catch (error) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies]);

  return cookies.authmaira ? <Outlet /> : <Navigate to="/login" />;
};
