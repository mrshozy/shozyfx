import "./app.css"
import {RouterProvider} from "react-router-dom";
import routes from "./routes";
import {ThemeProvider} from "./providers/Theme";
function App() {
  return (
      <ThemeProvider>
        <RouterProvider router={routes} />
      </ThemeProvider>
  );
}

export default App;
