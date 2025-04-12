import { Route, Routes } from "react-router-dom";
import AuthContext, { AuthProvider } from "./contexts/Auth/AuthContext";
import { HomeProvide } from "./contexts/Client/HomeContenxt";
import { privateRouter, publicRouter } from "./routers";
import NotFound from "./pages/404/NotFound";
import ClientRouter from "./routers/ClientRouter";
import AuthRouter from "./routers/AuthRouter";
import { useContext } from "react";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <AuthProvider>
        <HomeProvide>
          <Routes>
            {publicRouter.map((e, index) => {
              const Page = e.Element;
              return (
                <Route
                  key={index}
                  path={e.path}
                  element={
                    <AuthRouter>
                      <Page />
                    </AuthRouter>
                  }
                />
              );
            })}
            {user?.role !== null &&
              privateRouter.map((e, index) => {
                const Page = e.Element;
                return (
                  <Route
                    key={index}
                    path={e.path}
                    element={
                      <ClientRouter>
                        <Page />
                      </ClientRouter>
                    }
                  />
                );
              })}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </HomeProvide>
      </AuthProvider>
    </div>
  );
}

export default App;
