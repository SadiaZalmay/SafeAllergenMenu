import { createBrowserRouter, Route } from "react-router-dom";
import App from "../App";
import App2 from "../App2"; // Ensure this path is correct

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/App2",
    element: <App2 />,
  }
]);

export default router;
