/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Collapsible from "react-collapsible";
import { Button, ButtonToolbar } from "rsuite";
import { Modal } from "rsuite";
import { useAuth } from "../../hooks/auth";
import toast from "react-hot-toast";

let questionEditValue = {} as any;
let optionEditValue = {} as any;

const AdminQuestions: React.FC = () => {
  const { cookies } = useAuth();

  const [questions, setQuestions] = useState([] as any);
  const [openDeleteQuestion, setOpenDeleteQuestion] = React.useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [questionEditMode, setQuestionEditMode] = useState(false);
  const handleOpenDeleteQuestion = (questionId: string) => {
    setQuestionToDelete(questionId);
    setOpenDeleteQuestion(true);
  };
  const handleCloseDeleteQuestion = () => setOpenDeleteQuestion(false);
  const deleteQuestionHandler = async () => {
    try {
      const token = cookies.authmaira;
      const res = await api.delete("/question/" + questionToDelete, {
        headers: {
          "content-type": "application/json",
          "x-access-token": token,
        },
      });

      if (res.status === 204) {
        toast.success("La pregunta se elimino con  exito!");
        handleCloseDeleteQuestion();
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    } catch (error) {
      toast.error("Ocurrio un error al eliminar la pregunta.");
    }
  };
  const handleEditQuestion = async (questionId: string) => {
    if (!questionEditValue[questionId] || !questionEditValue[questionId].length || questionEditValue[questionId].length <= 0) {
      toast.error("El titulo de la pregunta no puede estar vacio.");
      return;
    }
    try {
      const token = cookies.authmaira;
      const res = await api.put(
        "/question/" + questionId,
        { title: questionEditValue[questionId] },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (res.status === 204) {
        toast.success("La pregunta se Edito con  exito!");

        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    } catch (error) {
      toast.error("Ocurrio un error al Editar la pregunta.");
    }
  };

  /* ---------- Options --------------- */
  const [optionEditMode, setOptionEditMode] = useState(false);
  const [openDeleteOption, setOpenDeleteOption] = React.useState(false);
  const [optionToDelete, setOptionToDelete] = useState<string | null>(null);
  const handleCloseDeleteOption = () => setOpenDeleteOption(false);
  const handleOpenDeleteOption = (optionId: string) => {
    setOptionToDelete(optionId);
    setOpenDeleteOption(true);
  };
  const deleteOptionHandler = async () => {
    try {
      const token = cookies.authmaira;
      const res = await api.delete("/option/" + optionToDelete, {
        headers: {
          "content-type": "application/json",
          "x-access-token": token,
        },
      });

      if (res.status === 204) {
        toast.success("La opcion se elimino con  exito!");
        handleCloseDeleteOption();
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    } catch (error) {
      toast.error("Ocurrio un error al eliminar la opcion.");
    }
  };
  const handleEditOption = async (optionId: string) => {
    console.log("Option to edit ID ", optionId);
    console.log("Option to edit optionEditValue ", optionEditValue);

    if (!optionEditValue[optionId] || !optionEditValue[optionId].length || optionEditValue[optionId].length <= 0) {
      toast.error("El titulo de la opcion no puede estar vacio.");
      return;
    }
    try {
      const token = cookies.authmaira;
      const res = await api.put(
        "/option/" + optionId,
        { name: optionEditValue[optionId] },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (res.status === 204) {
        toast.success("La opcion se Edito con  exito!");

        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    } catch (error) {
      toast.error("Ocurrio un error al Editar la opcion.");
    }
  };

  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        const res = await api("/question");
        if (res.status === 200) {
          setQuestions(res.data);
          // eslint-disable-next-line prefer-const
          let tmpArr = {} as any;
          for (let i = 0; i < res.data.length; i++) {
            tmpArr[res.data[i].title] = {
              options: res.data[i].options,
              selected: null,
            };
          }

          /*     console.log("RES DATA ", res.data); */
        }
      } catch (error) {
        /* console.log("Error cargando las preguntas ", error); */
      }
    };
    cargarPreguntas();
  }, []);

  const input_style = "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";
  const input_style2 = "form-control block w-full px-2 py-2  text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

  return (
    <>
      <div>
      
        {questions && questions.length && questions.length >= 1
          ? questions.map((question: any) => (
              <Collapsible key={question.id} trigger={`Pregunta ID: #${question.id}`}>
                <div className="pt-5">
                  {questionEditMode === false ? (
                    <p className="mt-5"> {question.title}</p>
                  ) : (
                    <div className="mb-6">
                      <input autoComplete="email" required type="text" value={questionEditValue[question.id]} onChange={(e) => (questionEditValue[question.id] = e.target.value)} placeholder={question.title} className={`${input_style}`} />
                    </div>
                  )}

                  <div className="flex mt-5 mb-6">
                    {questionEditMode === false ? (
                      <ButtonToolbar className="ml-auto">
                        <Button onClick={() => setQuestionEditMode(true)}> Editar Pregunta </Button>
                      </ButtonToolbar>
                    ) : (
                      <ButtonToolbar className="ml-auto">
                        <Button onClick={() => handleEditQuestion(question.id)}> Guardar Cambios </Button>
                      </ButtonToolbar>
                    )}

                    {questionEditMode === false ? (
                      <ButtonToolbar className="ml-auto">
                        <Button onClick={() => handleOpenDeleteQuestion(question.id)}> Eliminar Pregunta</Button>
                      </ButtonToolbar>
                    ) : (
                      <ButtonToolbar className="ml-auto">
                        <Button
                          onClick={() => {
                            questionEditValue = {} as any;
                            setQuestionEditMode(false);
                          }}
                        >
                          Cancelar Edicion
                        </Button>
                      </ButtonToolbar>
                    )}
                  </div>
                </div>
                <div className="PreguntaDiv">
                  {question.options && question.options.length && question.options.length >= 1
                    ? question.options.map((option: any) => (
                        <div key={option.id} className="flex pt-7 content-center items-center justify-center">
                          {optionEditMode === false ? (
                            <p className="mt-5"> {option.name}</p>
                          ) : (
                            <div className=" ">
                              <input required type="text" value={optionEditValue[option.id]} onChange={(e) => (optionEditValue[option.id] = e.target.value)} placeholder={option.name} className={`${input_style2}`} />
                            </div>
                          )}

                          {optionEditMode === false ? (
                            <ButtonToolbar className="ml-auto">
                              <Button onClick={() => setOptionEditMode(true)}> Editar Opcion </Button>
                            </ButtonToolbar>
                          ) : (
                            <ButtonToolbar className="ml-auto">
                              <Button onClick={() => handleEditOption(option.id)}> Guardar Cambios </Button>
                            </ButtonToolbar>
                          )}
                          {optionEditMode === false ? (
                            <ButtonToolbar className=" ">
                              <Button onClick={() => handleOpenDeleteOption(option.id)}> Eliminar Opcion</Button>
                            </ButtonToolbar>
                          ) : (
                            <ButtonToolbar className=" ">
                              <Button
                                onClick={() => {
                                  optionEditValue = {} as any;
                                  setOptionEditMode(false);
                                }}
                              >
                                Cancelar Edicion
                              </Button>
                            </ButtonToolbar>
                          )}
                        </div>
                      ))
                    : null}
                </div>
              </Collapsible>
            ))
          : null}
      </div>

      <Modal open={openDeleteQuestion} onClose={handleCloseDeleteQuestion}>
        <Modal.Header>
          <Modal.Title>Eliminar pregunta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Estas por eliminar la Pregunta con id: {questionToDelete}</p>
          <p>Estas seguro de proceder?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => deleteQuestionHandler()} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleCloseDeleteQuestion} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal accessKey="fd" open={openDeleteOption} onClose={handleCloseDeleteOption}>
        <Modal.Header>
          <Modal.Title>Eliminar Opcion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Estas por eliminar la Opcion con id: {optionToDelete}</p>
          <p>Estas seguro de proceder?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => deleteOptionHandler()} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleCloseDeleteOption} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminQuestions;
