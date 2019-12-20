import React from "react";
import { Tabs } from "antd";

import Panel from "components/Panel.jsx";

import TreatmentList from "views/Treatment/TreatmentList.jsx";
import SymptomList from "views/Symptom/SymptomList.jsx";
import UserList from "views/User/UserList.jsx";

const { TabPane } = Tabs;

export default class Home extends React.Component {
  render() { 
    return (
      <Panel title="Configuration">
        <Tabs>
          <TabPane tab="Soins" key="treatment">
            <TreatmentList />
          </TabPane>
          <TabPane tab="Symptômes" key="symptom">
            <SymptomList />
          </TabPane>
          <TabPane tab="Utilisateurs" key="user">
            <UserList />
          </TabPane>
        </Tabs>
      </Panel>
    );
  }
}