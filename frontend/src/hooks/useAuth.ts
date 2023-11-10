import {useContext} from "react";
import {AuthContext} from "../providers/Auth";

const useAuth = () =>{
    const context = useContext(AuthContext)
    if (!context) throw Error("context is undefined")
    return context
}

export default useAuth