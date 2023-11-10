import {createBrowserRouter} from "react-router-dom";
import Home from "./home";
import Dashboard from "./dashboard";
import Login from "./auth/login";
import Signup from "./auth/signup";
import Charts from "./dashboard/charts";
import DashboardHome from "./dashboard/app";
import Calendar from "./dashboard/calander";
import Signal from "./dashboard/signal";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        index: true
    },
    {
        path: "/dashboard",
        element: <Dashboard/>,
        index: false,
        children: [
            {
                path: "/dashboard",
                element: <DashboardHome/>,
                index: true
            },
            {
                path: "/dashboard/charts",
                element: <Charts/>,
                index: false
            },
            {
                path: "/dashboard/calender",
                element: <Calendar/>,
                index: false
            },
            {
                path: "/dashboard/signal",
                element: <Signal/>,
                index: false
            }
        ]
    },
    {
      path: "/auth",
        children : [
            {
                path: "/auth/login",
                index: true,
                element: <Login/>
            },
            {
                path: "/auth/signup",
                index: true,
                element: <Signup/>
            }
        ]
    }
])
export default routes