import { Router } from "./Router";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header";
import "./styles/global.scss";
import "./styles/global.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import { MapProvider } from "./contexts/MapContext";

function App() {
  return (
    <div className="App">
      <BrowserRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <AuthProvider>
          <MapProvider>
            <div className="app-container">
              <Header />
              <Router />
              <ToastContainer autoClose={3000} />
            </div>
          </MapProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
