import { Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/signin";
import { RequestRegistration } from "./pages/request-registration";
import { RegistrationRequests } from "./pages/registration-requests";
import { Registration } from "./pages/registration";
import { Users } from "./pages/users";
import CanGuest from "./utils/canGuest";
import CanAuth from "./utils/canAuth";
import CanAdmin from "./utils/canAdmin";
import TemporalData from "./pages/temporal-data";
import Relatorio from "./pages/relatorio";

export function Router() {
  const location = useLocation();

  return (
    <Routes key={location.pathname}>
      <Route
        path="/"
        element={
          <CanAuth>
            <Home />
          </CanAuth>
        }
      />
      <Route
        path="/temporal-data"
        element={
          <CanAuth>
            <TemporalData />
          </CanAuth>
        }
      />{" "}
      <Route
        path="/relatorio"
        element={
          <CanAuth>
            <Relatorio />
          </CanAuth>
        }
      />
      <Route
        path="/signin"
        element={
          <CanGuest>
            <SignIn />
          </CanGuest>
        }
      />
      <Route
        path="/registration"
        element={
          <CanAdmin>
            <Registration />
          </CanAdmin>
        }
      />
      <Route
        path="/request-registration"
        element={
          <CanGuest>
            <RequestRegistration />
          </CanGuest>
        }
      />
      <Route
        path="/users"
        element={
          <CanAdmin>
            <Users />
          </CanAdmin>
        }
      />
      <Route
        path="/registration-requests"
        element={
          <CanAdmin>
            <RegistrationRequests />
          </CanAdmin>
        }
      />
      <Route
        path="*"
        element={
          <CanAuth>
            {" "}
            <Home />
          </CanAuth>
        }
      />
    </Routes>
  );
}
