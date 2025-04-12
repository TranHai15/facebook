import Login from "@pages/Auth/login/login.jsx";
import Register from "@pages/Auth/register/Register.jsx";
import Home from "../pages/Client/home/index.jsx";
export const publicRouter = [
  { path: "/login", Element: Login },
  { path: "/register", Element: Register }
];
export const privateRouter = [{ path: "/", Element: Home }];

export const AdminRouter = [];
