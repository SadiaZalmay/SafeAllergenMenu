import { createBrowserRouter, Route } from "react-router-dom";
import App from "../App"; // Adjust the import path as necessary
import App2 from "../App2"; // Adjust the import path as necessary

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/App2",
    element: <App2 />,
  },
]);

export default router;
