import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import App2 from "../App2";

// Admin Panel Components
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

// Create a browser router for the application routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Main application entry point
  },
  {
    path: "/App2",
    element: <App2 />, // Alternative application route
  },
  // Admin panel routes
  {
    path: "/AP",
    element: <Menu />, // Admin panel menu page
  },
  {
    path: "/MenuEdit/:id",
    element: <MenuEdit />, // Edit menu item by ID
  },
  {
    path: "/MenuAdd",
    element: <MenuAdd />, // Add a new menu item
  },
  {
    path: "/Page1",
    element: <Page1 />, // Allergen selection page
  },
  {
    path: "/Page1Add",
    element: <Page1Add />, // Add new allergen info
  },
  {
    path: "/Page1Edit/:id",
    element: <Page1Edit />, // Edit allergen info by ID
  },
  {
    path: "/Page2",
    element: <Page2 />, // Filtered safe menu page
  },
  {
    path: "/Page2Add",
    element: <Page2Add />, // Add new filtered safe menu item
  },
  {
    path: "/Page2Edit/:id",
    element: <Page2Edit />, // Edit filtered safe menu item by ID
  },
  // {
  //   path: "/Logout",
  //   element: <Logout />, // Logout page
  // },
  {
    path: "/ChangePassword",
    element: <ChangePassword />, // Change user password page
  },
]);

export default router; // Export the router for use in the application
