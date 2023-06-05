/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Collapsible from "react-collapsible";
import { Button, ButtonToolbar } from "rsuite";
import { Modal } from "rsuite";

const AdminQuestions: React.FC = () => {
  const [questions, setQuestions] = useState([] as any);
  const [open, setOpen] = React.useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const cargarPreguntas = async () => {
        setToDelete(null)
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

          console.log("RES DATA ", res.data);
        }
      } catch (error) {
        console.log("Error cargando las preguntas ", error);
      }
    };
    cargarPreguntas();
  }, []);

 
  return (
    <>
      <div>
        {questions && questions.length && questions.length >= 1
          ? questions.map((question: any) => (
              <Collapsible key={question.id} trigger={`Pregunta ID: #${question.id}`}>
                <p>
                  {question.title}
                  <div className="flex mt-10">
                    <ButtonToolbar className="ml-auto">
                      <Button> Editar Pregunta</Button>
                    </ButtonToolbar>
                    <ButtonToolbar className="ml-auto">
                      <Button onClick={() => handleOpen()}> Eliminar Pregunta</Button>
                    </ButtonToolbar>
                  </div>
                </p>
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

      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Eliminación de sugerencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Estas por eliminar la sugerencia con id: {toDelete}</p>
          <p>Estas seguro de proceder?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary">Ok</Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminQuestions;
