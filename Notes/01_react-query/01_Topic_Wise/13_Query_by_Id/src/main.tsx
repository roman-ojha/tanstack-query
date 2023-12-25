import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home";
import RQSuperHeroes from "./pages/RQSuperHeroes";
import SuperHeroes from "./pages/SuperHeroes";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RQSuperHero from "./pages/RQSuperHero";

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
  {
    path: "/rq-super-heroes/:heroId",
    element: <RQSuperHero />,
  },
]);

// create a react query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Provide the react query client instance to you application */}
    {/* we now have every hooks and method that react query provides inside our application */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom"
        buttonPosition="bottom-right"
      />
    </QueryClientProvider>
  </React.StrictMode>
);
