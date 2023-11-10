import "./app.css"
import {RouterProvider} from "react-router-dom";
import routes from "./routes";
import {ThemeProvider} from "./providers/Theme";
import {AuthProvider} from "./providers/Auth";
import {Toaster} from "./components/ui/toaster";
import {Settings} from "./providers/Settings";
function App() {
  return (
      <ThemeProvider>
          <Settings>
              <Toaster />
              <AuthProvider>
                  <RouterProvider router={routes} />
              </AuthProvider>
          </Settings>
      </ThemeProvider>
  );
}

export default App;
