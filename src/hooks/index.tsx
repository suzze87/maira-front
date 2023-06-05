import React, { PropsWithChildren } from "react";
import { UserProvider } from "./auth";
import { Toaster } from "react-hot-toast";

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <>
    <UserProvider>{children}</UserProvider>
    <Toaster
  position="top-center"
  reverseOrder={false}
/>
  </>
);

export default AppProvider;
