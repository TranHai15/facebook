import { Route, Routes } from "react-router-dom";
import { AdminRouter, ClientRouter } from "@routers";
import { Login, Register } from "@pages";
import { AuthProvider } from "./contexts/Auth/AuthContext";
import { HomeProvide } from "./contexts/Client/HomeContenxt";

function App() {
  return (
    <div>
      <AuthProvider>
        <HomeProvide>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/*" element={<AdminRouter />} />
            <Route path="/*" element={<ClientRouter />} />
          </Routes>
        </HomeProvide>
      </AuthProvider>
    </div>
  );
}

export default App;
