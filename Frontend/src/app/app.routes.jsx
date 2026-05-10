import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1 className="text-green-600 bg-black h-screen text-center pt-10">Hello world</h1>,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/create-product",
        element: <CreateProduct />,
    }
])