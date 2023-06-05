import React from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { ProtectRoutes } from "./hooks/protectedRoutes";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Heading from "./Components/Heading";

export default function App() {
  return (
    <main className="min-h-screen pt-20 flex flex-col items-center">
      <div className="h-full  border-b flex-col border-gray-300 p-12 max-w-4xl mx-auto bg-white rounded-md  flex justify-center items-center">
        <Heading />
        <Routes>
          <Route path="/" element={<Navigate to="home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectRoutes />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </div>

      <div className="w-full max-w-md items-center justify-center font-mono text-sm mt-4 select-none">
        <p className="  text-center flex-col left-0 top-0 flex  justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl   dark:from-inherit  static  w-auto  rounded-xl  border  bg-gray-200  p-4 dark:bg-zinc-800/30">
          <span>Dirección Provincial de Vialidad&nbsp; </span>
          <code className="font-mono font-bold">- Provincia de Formosa -</code>
        </p>
      </div>
    </main>
  );
}
