import { routes } from "./app.routes"
import { RouterProvider } from "react-router"
import "./App.css"

function App() {

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
