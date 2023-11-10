import React, {useState} from 'react';
import Layout from "../../layouts";
import {Outlet} from "react-router-dom";

interface DashboardProps {

}

const Dashboard: React.FC<DashboardProps> = () => {
    const [title, setTitle] = useState("Dashboard")
    const [fixed, changeFixed] = useState(false)
    const onChange = (title:string) => setTitle(title);
    const setFixed = (condition:boolean) => changeFixed(condition);
    return (
        <Layout isDashboard title={title} className={"flex w-full h-full"} fixed={fixed}>
            <div className={"flex h-full w-full overflow-auto"}>
                <Outlet context={[onChange, setFixed]}/>
            </div>
        </Layout>
  );
};

export default Dashboard;
