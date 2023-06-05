/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Collapsible from "react-collapsible";
import { Button, ButtonToolbar } from "rsuite";
import { Modal } from "rsuite";
import { useAuth } from "../../hooks/auth";
import toast from "react-hot-toast";

const AdminQuestions: React.FC = () => {
  const { cookies } = useAuth();
  const [questions, setQuestions] = useState([] as any);
  const [openDeleteQuestion, setOpenDeleteQuestion] = React.useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
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
      console.log("  eliminando pregunta res", res);
      if(res.status === 204){
        toast.success("La pregunta se cargo con  exito!");
        handleCloseDeleteQuestion()
        setTimeout(()=>{
          window.location.reload()
        },800)
      }
    } catch (error) {
      console.log("Error eliminando pregunta ", error);
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

  return (
    <>
      <div>
        <pre className="mt-12 mb-12">(maira) Esta parte no esta terminada!!</pre>
        {questions && questions.length && questions.length >= 1
          ? questions.map((question: any) => (
              <Collapsible key={question.id} trigger={`Pregunta ID: #${question.id}`}>
                <div className="pt-5">
                  <p className="mt-5"> {question.title}</p>
                  <div className="flex mt-5 mb-6">
                    <ButtonToolbar className="ml-auto">
                      <Button> Editar Pregunta</Button>
                    </ButtonToolbar>
                    <ButtonToolbar className="ml-auto">
                      <Button onClick={() => handleOpenDeleteQuestion(question.id)}> Eliminar Pregunta</Button>
                    </ButtonToolbar>
                  </div>
                </div>
                <div className="PreguntaDiv">
                  {question.options && question.options.length && question.options.length >= 1
                    ? question.options.map((option: any) => (
                        <div key={option.id} className="flex">
                          <p>{option.name}</p>{" "}
                          <ButtonToolbar className="ml-auto">
                            <Button> Editar Opcion</Button>
                          </ButtonToolbar>
                          <ButtonToolbar className="">
                            <Button> Eliminar Opcion</Button>
                          </ButtonToolbar>
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
    </>
  );
};

export default AdminQuestions;
