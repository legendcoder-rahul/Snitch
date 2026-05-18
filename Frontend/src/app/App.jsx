import { routes } from "./app.routes"
import { RouterProvider } from "react-router"
import "./App.css"
import { useSelector } from "react-redux"
import { useAuth } from "../features/auth/hook/useAuth"
import { useEffect } from "react"

function App() {
  const { handleGetMe } = useAuth()
  const user = useSelector(state => state.auth.user)
  console.log(user)

  useEffect(() => {
    handleGetMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
