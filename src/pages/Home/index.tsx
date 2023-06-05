/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import api from "../../services/api";
// eslint-disable-next-line prefer-const
import toast from "react-hot-toast";
import Loading from "../../Components/Loading";
export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        const res = await api("/question");
        if (res.status === 200) {
          setQuestions(res.data);
        /*   console.log("Questions response ", res.data); */
          // eslint-disable-next-line prefer-const
          let tmpArr = {} as any;

          for (let i = 0; i < res.data.length; i++) {
            tmpArr[res.data[i].title] = {
              options: res.data[i].options,
              selected: null,
            };
          }
          setOptions(tmpArr as any);
        }
      } catch (error) {
        /* console.log("Error cargando las preguntas ", error); */
      }
    };
    cargarPreguntas();
  }, []);

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (suggestion && suggestion.length && suggestion.length >= 1) {
        const ressuggestion = await api.post(
          "/suggestion",
          { value: suggestion },
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );
        if (ressuggestion.status === 201) {
          /* console.log("La sugerencia se cargo ", ressuggestion.data); */
          setSuggestion("");
        }
      }

      for (let i = 0; i < questions.length; i++) {
        const questionTitle = (questions[i] as any).title;
       /*  const questionId = (questions[i] as any).id; */

        const selectedAnswer = (options[questionTitle] as any).selected;

      /*   console.log("Questions Found questionId ", questionId);
        console.log("Questions Found questionTitle ", questionTitle);
        console.log("Questions Found answer ", selectedAnswer);
        console.log("Questions Found options ", (questions[i] as any).options); */

        if (!selectedAnswer || selectedAnswer === null || typeof selectedAnswer === "undefined") {
          toast.error("Error: Debes seleccionar una opcion por pregunta!");
          return;
        }

        await api.patch(
          "/option/" + selectedAnswer,
          {},
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );

        /* console.log("Seend encuesta  ", res); */
      }

      toast.success("La encuesta fue enviada con exito. Muchas gracias por su colaboración!");

      await setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      /* console.log("Form error", error); */
      toast.error("Ocurrio un error al enviar la encuesta. Por favor complete todos los campos e intente de nuevo!");
    } finally {
      setLoading(false);
    }
  };

  const InputCustom: React.FC<any> = ({ optionId, optionName, questionTitle }: any) => {
    const [selected, setSelected] = useState(false);
    useEffect(() => {
      setSelected((options[questionTitle] as any).selected === optionId ? true : false);
    }, [selected, optionId, optionName, questionTitle]);

    const handleOption = (e: string, questionTitle: string) => {
      // eslint-disable-next-line prefer-const
      let tmpOptions: any = options;
      tmpOptions[questionTitle as any].selected = e;
      setOptions({ ...tmpOptions });
    };

    return (
      <div key={optionId} className="mr-4">
        <label className="inline-flex items-center">
          <input onChange={(_e) => handleOption(optionId, questionTitle)} type="radio" className="form-radio" value={optionId} checked={selected} />
          <span className="ml-2">{optionName}</span>
        </label>
      </div>
    );
  };

  return (
    <form onSubmit={handleForm} className="mb-4 text-left w-full mt-4">
      <div className="flex flex-col">
        {questions && questions.length && questions.length >= 1
          ? questions.map((question: any) => (
              <div key={question.id}>
                <label className="block text-gray-700 font-bold mb-2 mt-5">{question.title}</label>
                {question.options && question.options.length && question.options.length >= 1
                  ? (options[question.title] as any).options.map((option: any) => {
                      return <InputCustom key={option.id} questionTitle={question.title} optionId={option.id} optionName={option.name} />;
                    })
                  : null}
              </div>
            ))
          : null}

        <>
          <br />
          <br />
          <hr />
          <br />
          <br />
        </>

        <div className="max-w-2xl mx-auto">
          <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
            ¡Nos encantaría conocer tus recomendaciones personales para mejorar la seguridad vial! Por favor, comparte cualquier sugerencia, consejo o experiencia que consideres importante. Tu aporte es valioso para crear un entorno vial más seguro para todos. ¡Gracias por contribuir!
          </label>
          <textarea onChange={(e) => setSuggestion(e.target.value)} value={suggestion} id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tu sugerencia..."></textarea>
        </div>

        <br />
        <br />
        <div className="flex justify-center">{loading ? <Loading /> : <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enviar Encuesta</button>}</div>
      </div>
    </form>
  );
}
