import {createBrowserRouter} from "react-router-dom";
import Home from "./home";
import Dashboard from "./dashboard";
import Login from "./auth/login";
import Signup from "./auth/signup";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        index: true
    },
    {
        path: "/dashboard",
        element: <Dashboard/>,
        index: false
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