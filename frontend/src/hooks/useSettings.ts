import {useContext} from "react";
import {SettingsContext} from "../providers/Settings";

const useSettings = () => {
    const context = useContext(SettingsContext)
    if (!context) throw Error("context is not defined")
    return context
}

export default  useSettings