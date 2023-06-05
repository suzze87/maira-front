/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/auth";
import api from "../../services/api";
import Loading from "../../Components/Loading";
import { Button, ButtonToolbar } from "rsuite";

const AddQuestion: React.FC = () => {
  const { cookies } = useAuth();
  const [loading, setLoading] = useState(false);

  const [pregunta, setPregunta] = useState("");
  const [opciones, setOpciones] = useState([] as any);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (file && allowedTypes.includes(file.type)) {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
      toast.error("Por favor, selecciona un archivo de imagen válido (JPEG, PNG, GIF).");
    }
  };

  const llenarOpcion = (id: number, titulo: string) => {
    // hacer una copia del arreglo original
    const updatedOpciones = opciones.map((opcion: any) => {
      // si el id coincide, crear una copia del objeto original y actualizar el campo 'titulo'
      if (opcion.id === id) {
        return { ...opcion, titulo: titulo };
      }
      // de lo contrario, simplemente devolver el objeto original
      return opcion;
    });

    // establecer el estado con el arreglo actualizado
    setOpciones(updatedOpciones);
  };

  const borrarOpcion = (e: any, id: number) => {
    e.preventDefault();
    const nuevasOpciones = opciones.filter((opcion: any) => opcion.id !== id);
    setOpciones(nuevasOpciones);
  };
  const agregarOpcion = (e: any) => {
    e.preventDefault();
    setOpciones((p: any) => [...p, { id: opciones.length + 1, titulo: "" }]);
  };

  const cargarOpciones = async () => {
    try {
      const token = cookies.authmaira;
      const optionsArr = [];

      if (opciones.length && opciones.length >= 1) {
        for (let i = 0; i < opciones.length; i++) {
          if (opciones[i].titulo.length && opciones[i].titulo.length > 1) {
            const res = await api.post(
              "/option",
              { name: opciones[i].titulo, picture: null },
              {
                headers: {
                  "content-type": "application/json",
                  "x-access-token": token,
                },
              }
            );

            if (res.status === 201) {
              optionsArr.push(res.data);
            }
          }
        }
      }
      return optionsArr;
    } catch (er) {
      /* console.log("Error cargando opciones ", er); */
      return [];
    }
  };

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = cookies.authmaira;
      if (!pregunta || !pregunta.length) {
        toast.error("Error: La pregunta no debe estar vacia!");
        return;
      }
      if (!opciones || !opciones.length || opciones.length <= 0) {
        toast.error("Error: Deberias agregar a menos una opcion a la pregunta!");
        return;
      }
      const opcionesCargadas = await cargarOpciones();

      let picture = null;

      if (selectedImage) {
        try {
          const data = new FormData();
          data.append("file", selectedImage);
          data.append("upload_preset", "mairafolder");
          const resCloud = await fetch("https://api.cloudinary.com/v1_1/dm7xgtdus/image/upload", {
            method: "POST",
            body: data,
          });
          const cloudFile = await resCloud.json();
          picture = cloudFile.secure_url;
        } catch (error) {
          picture = null;
        }
      }

      /*  console.log("Opciones opcionesCargadas ", opcionesCargadas); */
      const res = await api.post(
        "/question",
        { title: pregunta, picture, options: opcionesCargadas },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": token,
          },
        }
      );
      if (res.status === 201) {
        /*  console.log("La pregunta se cargo ", res.data.id); */
        toast.success("La pregunta se cargo con  exito!");
        setPregunta("");
        setOpciones([]);
        setSelectedImage(null)
      }
      /* console.log("Respuesta ", res.data); */
    } catch (er) {
      /*   console.log("Error cargando pregunta ", er); */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <form onSubmit={handleForm} className="w-full max-w-sm mt-4">
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Pregunta
            </label>
          </div>
          <div className="md:w-2/3">
            <input onChange={(e) => setPregunta(e.target.value)} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-pregunta" type="text" value={pregunta} />
          </div>
        </div>

        <div className="md:flex md:items-center mb-6">
          <label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="inline-full-image">
            Imagen
          </label>
          <input name="inline-full-image" type="file" accept="image/jpeg, image/png, image/gif" onChange={handleImageChange} />
          {selectedImage && (
            <>
              <img src={URL.createObjectURL(selectedImage)} alt="Imagen seleccionada" width={180} height={37} />
              <ButtonToolbar className="ml-auto">
                <Button onClick={() => setSelectedImage(null)}> Quitar </Button>
              </ButtonToolbar>
            </>
          )}
        </div>

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Opciones
            </label>
          </div>
          <div className="md:w-2/3">
            {opciones && opciones.length > 0
              ? opciones.map((opcion: any) => (
                  <div key={opcion.id} className="flex flex-row">
                    <input onChange={(e) => llenarOpcion(opcion.id, e.target.value)} className="bg-gray-200 mb-1 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" />
                    <button onClick={(e) => borrarOpcion(e, opcion.id)} className="flex items-center justify-center font-bold py-2 px-4  ">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />{" "}
                      </svg>
                    </button>
                  </div>
                ))
              : null}
            <button className="shadow rounded  py-2 px-4" onClick={(e) => agregarOpcion(e)}>
              Agregar
            </button>
          </div>
        </div>

        <div className="md:flex md:items-center justify-center">
          {loading ? (
            <Loading />
          ) : (
            <button className="mt-5  shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
              Cargar Pregunta
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddQuestion;
