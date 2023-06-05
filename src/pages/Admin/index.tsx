import React from "react";

import AddQuestion from "./AddQuestion";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Suggestions from "./Suggestions";
import  Statisc  from "./Statisc";

const Admin: React.FC = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Agregar Pregunta</Tab>
        <Tab>Estadisticas</Tab>
        <Tab>Sugerencias</Tab>
      </TabList>

      <TabPanel>
        <h2 className="text-base font-semibold leading-6 text-gray-900 mb-4 text-center" id="modal-title">
          Crear Nueva Pregunta
        </h2>
        <AddQuestion />
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
