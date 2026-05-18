import { routes } from "./app.routes"
import { RouterProvider } from "react-router"
import "./App.css"
import { useSelector } from "react-redux"

function App() {

  const user = useSelector(state => state.auth.user)
  console.log(user)

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
