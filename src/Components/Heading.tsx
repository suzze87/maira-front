import React, { useEffect, useState } from "react";
import logo1 from "../assets/LOGO_DPV.gif";
import logo2 from "../assets/direcc1.jpg";
import { useAuth } from "../hooks/auth";

const Heading: React.FC = () => {
  const [headTxt, setHeadTxt] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    const pathName = window.location.pathname;
    if (!pathName || pathName === "/home") {
      setHeadTxt("- ENCUESTA ANONIMA -");
    }
    if (pathName === "/login") {
      setHeadTxt("- INICIAR SESION -");
    }
    if (pathName === "/admin") {
      setHeadTxt("- ZONA ADMINISTRACION -");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return (
    <div className="select-none">
      <div id="logos" className="flex flex-row items-center justify-center">
        <img className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert" src={logo1} alt="Next.js Logo" width={180} height={37} />
        <img className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert" src={logo2} alt="Next.js Logo" width={180} height={37} />
      </div>
      <>
        <div className="flex items-center justify-center mb-4 mt-3 ">
          <p className="text-2xl font-semibold">SEMINARIO DE SEGURIDAD VIAL</p>
        </div>
        <div className="flex items-center justify-center mb-4 mt-3">
          <p className="text-1xl font-normal">{headTxt}</p>
        </div>
        {window.location.pathname === "/admin" && (
          <div className="flex items-center justify-center mb-9 mt-3">
            <button className="inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full" onClick={() => logout()}>
              Cerrar Sesión
            </button>
          </div>
        )}
      </>
    </div>
  );
};

export default Heading;
