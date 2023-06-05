import React from "react";
import loader from "../assets/loading-loading-forever.gif";

const Loading: React.FC = () => {
  return <img className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert" src={loader} alt="Next.js Logo" width={37} height={37} />;
};
export default Loading;
