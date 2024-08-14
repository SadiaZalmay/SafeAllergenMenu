import { createBrowserRouter, Route } from "react-router-dom";
import App from "../App";
import App2 from "../App2"; 

//Admin Panel
import Menu from "../AP/pages/Menu";
import MenuEdit from "../AP/pages/MenuEdit";
import MenuAdd from "../AP/pages/MenuAdd";
import Page1 from "../AP/pages/Page1";
import Page1Add from "../AP/pages/Page1Add";
import Page1Edit from "../AP/pages/Page1Edit";
import Page2 from "../AP/pages/Page2";
import Page2Add from "../AP/pages/Page2Add";
import Page2Edit from "../AP/pages/Page2Edit";
import ChangePassword from "../AP/pages/ChangePassword";
// import Logout from "../AP/pages/Logout";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/App2",
    element: <App2 />,
  },
  //Admin panel
  {
    path: "/AP",
    element: <Menu />,
  },
  {
    path: "/MenuEdit/:id",
    element: <MenuEdit />,
  },
  {
    path: "/MenuAdd",
    element: <MenuAdd />,
  },
  {
    path: "/Page1",
    element: <Page1 />,
  },
  {
    path: "/Page1Add",
    element: <Page1Add />,
  },
  {
    path: "/Page1Edit/:id",
    element: <Page1Edit />,
  },
  {
    path: "/Page2",
    element: <Page2 />,
  },
  {
    path: "/Page2Add",
    element: <Page2Add />,
  },
  {
    path: "/Page2Edit/:id",
    element: <Page2Edit />,
  },
  // {
  //   path: "/Logout",
  //   element: <Logout />,
  // },
  {
    path: "/ChangePassword",
    element: <ChangePassword />,
  },
]);

export default router;
