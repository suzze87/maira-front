/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const UserContext = createContext({} as any);

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const [cookies, setCookies, removeCookie] = useCookies();
  const [user, setUser] = useState<object | null>(null);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await api.post("/auth/signin", {
        email: email,
        password: password,
      });
      setCookies("authmaira", res.data.token); // your token
      navigate("/admin");
    } catch (error) {
      if ((error as any).response && (error as any).response.data) {
        toast.error((error as any).response.data.message);
        return;
      }
      toast.error("Error de inicio de sesion");
    }
  };

  const logout = () => {
    ["authmaira"].forEach((obj) => removeCookie(obj)); // remove data save in cookies
    /* navigate("/login"); */
    window.location.reload();
  };

  const value: any = useMemo(
    () => ({
      cookies,
      login,
      logout,
      user,
      setUser,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cookies]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
  return useContext(UserContext);
};
