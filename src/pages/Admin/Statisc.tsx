/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import api from "../../services/api";
import "react-tabs/style/react-tabs.css";
import "./index.css";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const BarComponentDoughnut: React.FC<any> = ({ questionTitle, questionOptions }) => {
  const data = {
    labels: [] as any,
    datasets: [
      {
        label: "# de  Votos",
        data: [] as any,
        backgroundColor: ["rgba(255, 99, 132,1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
        borderWidth: 1,
      },
    ],
  };

  for (let i = 0; i < questionOptions.length; i++) {
    data.labels.push(questionOptions[i].name);
    data.datasets[0].data.push(questionOptions[i].value);
  }

  return (
    <div className=" max-w-md select-none">
      <h2 className="mt-10 mb-5 text-2xl">{questionTitle}</h2>
      <div className="Statiscs">
        <p>
          <strong>Total de encuestados:</strong> {questionOptions.reduce((acumulador: any, pregunta: any) => acumulador + pregunta.value, 0)}
        </p>
        {questionOptions && questionOptions.length && questionOptions.length >= 1
          ? questionOptions
              .sort((a: any, b: any) => a.name.localeCompare(b.name))
              .map((option: any) => (
                <p key={option.name}>
                  {option.name} <strong> ( % {Number(((option.value / questionOptions.reduce((acumulador: any, pregunta: any) => acumulador + pregunta.value, 0)) * 100).toFixed(1))} ) </strong>
                </p>
              ))
          : null}
      </div>
      <Doughnut data={data} options={{ responsive: true }} />
    </div>
  );
};

const Statisc: React.FC = () => {
  const [questions, setQuestions] = useState([] as any);

  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        const res = await api("/question");
        if (res.status === 200) {
          setQuestions(res.data.options.sort((a:any, b:any) => a.name.localeCompare(b.name)));
          // eslint-disable-next-line prefer-const
          let tmpArr = {} as any;
          for (let i = 0; i < res.data.length; i++) {
            tmpArr[res.data[i].title] = {
              options: res.data[i].options,
              selected: null,
            };
          }

          /* console.log("RES DATA ", res.data); */
        }
      } catch (error) {
        /* console.log("Error cargando las preguntas ", error); */
      }
    };
    cargarPreguntas();
  }, []);

  if (!questions || !questions.length || questions.length <= 0) {
    return null;
  }

  return questions.map((question: any) => (
    <div key={question.id} className="Estadisticas">
      <BarComponentDoughnut questionTitle={question.title} questionOptions={question.options} />
    </div>
  ));
};

export default Statisc;
