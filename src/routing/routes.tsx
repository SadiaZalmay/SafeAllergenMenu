import { createBrowserRouter, Route } from "react-router-dom";
import App from "../App";
import App2 from "../App2"; 

//Admin Panel
import Menu from "../AP/pages/Menu";
import MenuEdit from "../AP/pages/MenuEdit";
import MenuAdd from "../AP/pages/MenuAdd";
import Page1 from "../AP/pages/Page1";
import Page2 from "../AP/pages/Page2";
import ChangePassword from "../AP/pages/ChangePassword";


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
    path: "/Page2",
    element: <Page2 />,
  },
  {
    path: "/ChangePassword",
    element: <ChangePassword />,
  },
]);

export default router;
