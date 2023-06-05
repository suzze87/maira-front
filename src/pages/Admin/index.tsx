import React from "react";

import AddQuestion from "./AddQuestion";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Suggestions from "./Suggestions";
import  Statisc  from "./Statisc";
import AdminQuestions from "./AdminQuestions";

const Admin: React.FC = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Agregar Pregunta</Tab>
        <Tab>Administrar Preguntas</Tab>
        <Tab>Estadisticas</Tab>
        <Tab>Sugerencias</Tab>
      </TabList>

      <TabPanel>
        <h2 className="text-2xl font-semibold mb-10 mt-10 text-center" id="modal-title">
          Crear Nueva Pregunta
        </h2>
        <AddQuestion />
      </TabPanel>
      <TabPanel>
        <AdminQuestions />
      </TabPanel>
      <TabPanel>
        <Statisc />
      </TabPanel>
      <TabPanel>
        <Suggestions />
      </TabPanel>
    </Tabs>
  );
};

export default Admin;
