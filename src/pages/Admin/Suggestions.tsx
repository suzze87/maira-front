/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Collapsible from "react-collapsible";
import "./index.css";
import api from "../../services/api";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

const Suggestions: React.FC = () => {
  const [sugerencias, setSugerencias] = useState([] as any);

  useEffect(() => {
    const fetchSugerencias = async () => {
      const response = await api.get("/suggestion");

      if (response && response.status === 200) {
        setSugerencias(response.data);
        console.log("Response suggestions ", response.data);
      }
    };
    fetchSugerencias();
  }, []);

  if (!sugerencias.length || sugerencias.length <= 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Sugerencias de los visitantes</h1>
      </div>
    );
  }

  return (
    <div>
         <h1 className="text-2xl text-center pt-5 pb-5 font-semibold">Sugerencias para mejoras de los visitantes</h1>
      {sugerencias.map((suggestion: any) => (
        <Collapsible key={suggestion._id} trigger={`Sugerencia Codigo: #${suggestion._id}`}>
          <p>{suggestion.value}</p>
          <pre>{moment(suggestion.createdAt).format("MM-DD-YYYY hh:mm A")}</pre>
        </Collapsible>
      ))}
    </div>
  );
};

export default Suggestions;
