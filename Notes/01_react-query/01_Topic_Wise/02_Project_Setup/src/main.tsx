import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home";
import RQSuperHeroes from "./pages/RQSuperHeroes";
import SuperHeroes from "./pages/SuperHeroes";
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/super-heroes",
    element: <SuperHeroes />,
  },
  {
    path: "/rq-super-heroes",
    element: <RQSuperHeroes />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
