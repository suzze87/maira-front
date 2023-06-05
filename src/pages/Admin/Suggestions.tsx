/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Collapsible from "react-collapsible";
import "./index.css";
import api from "../../services/api";
import moment from "moment";
import "moment/locale/es";
import { Modal, Button, ButtonToolbar  } from "rsuite";
import { useAuth } from "../../hooks/auth";
import toast from "react-hot-toast";

moment.locale("es");

const Suggestions: React.FC = () => {
  const { cookies } = useAuth();
  const [sugerencias, setSugerencias] = useState([] as any);
  const [open, setOpen] = React.useState(false);

  const [toDelete, setToDelete] = useState<string | null>(null);

  const handleOpen = (id: string) => {
    setToDelete(id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleDeleteSuggestion = async () => {
    try {
      const token = cookies.authmaira;
      if (toDelete) {
        const res = await api.delete("/suggestion/" + toDelete, {
          headers: {
            "content-type": "application/json",
            "x-access-token": token,
          },
        });
        if (res.status == 204) {
          toast.success("La sugerencia se elimino con  exito!");
          handleClose();
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error("Ocurrio un error al eliminar la sugerencia. Intente de nuevo");
          handleClose();
        }
      }
    } catch (error) {
    /*   console.log("Error eliminando la sugerencia"); */
    }
  };

  useEffect(() => {
    const fetchSugerencias = async () => {
      const response = await api.get("/suggestion");

      if (response && response.status === 200) {
        setSugerencias(response.data);
        /* console.log("Response suggestions ", response.data); */
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
        <Collapsible key={suggestion.id} trigger={`Sugerencia Codigo: #${suggestion.id}`}>
          <p>{suggestion.value}</p>
          <div className="flex">
            <pre>{moment(suggestion.createdAt).format("MM-DD-YYYY hh:mm A")}</pre>
            <ButtonToolbar className="ml-auto">
              <Button onClick={() => handleOpen(suggestion.id)}> Eliminar</Button>
            </ButtonToolbar>
          </div>
        </Collapsible>
      ))}

      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Eliminación de sugerencia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Estas por eliminar la sugerencia con id: {toDelete}</p>
          <p>Estas seguro de proceder?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleDeleteSuggestion()} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Suggestions;
