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
import Login from "../AP/pages/Login";
import Register from "../AP/pages/Register";
import ForgotPassword from "../AP/pages/ForgotPassword"; 
import ChangePassword from "../AP/pages/ChangePassword";
import AuthGuard from "../AP/pages/AuthGuard"; 


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
  // Admin panel routes with AuthGuard
  {
    path: "/AP",
    element: (
      <AuthGuard>
        <Menu /> 
      </AuthGuard>
    ), // Admin panel menu page
  },
  {
    path: "/MenuEdit/:id",
    element: (
      <AuthGuard>
        <MenuEdit />
      </AuthGuard>
    ), // Edit menu item by ID
  },
  {
    path: "/MenuAdd",
    element: (
      <AuthGuard>
        <MenuAdd />
      </AuthGuard>
    ), // Add a new menu item
  },
  {
    path: "/Page1",
    element: (
      <AuthGuard>
        <Page1 />
      </AuthGuard>
    ), // Allergen selection page
  },
  {
    path: "/Page1Add",
    element: (
      <AuthGuard>
        <Page1Add />
      </AuthGuard>
    ), // Add new allergen info
  },
  {
    path: "/Page1Edit/:id",
    element: (
      <AuthGuard>
        <Page1Edit />
      </AuthGuard>
    ), // Edit allergen info by ID
  },
  {
    path: "/Page2",
    element: (
      <AuthGuard>
        <Page2 />
      </AuthGuard>
    ), // Filtered safe menu page
  },
  {
    path: "/Page2Add",
    element: (
      <AuthGuard>
        <Page2Add />
      </AuthGuard>
    ), // Add new filtered safe menu item
  },
  {
    path: "/Page2Edit/:id",
    element: (
      <AuthGuard>
        <Page2Edit />
      </AuthGuard>
    ), // Edit filtered safe menu item by ID
  },
  {
    path: "/Login",
    element: <Login />, // Login page
  },
  {
    path: "/ForgotPassword",
    element: <ForgotPassword />, // ForotPassword page
  },
  {
    path: "/Register",
    element: <Register />, // Register page
  },
  {
    path: "/ChangePassword",
    element: <ChangePassword />, // Change user password page
  },
]);

export default router; // Export the router for use in the application
