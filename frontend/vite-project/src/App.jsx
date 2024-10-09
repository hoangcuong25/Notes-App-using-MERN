import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Signup from "./pages/Signup/Signup"

const routes = (
  <BrowserRouter>
    <Routes>
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<Signup />} />
    </Routes>
  </BrowserRouter>
)

function App() {

  return (
    <>
      {routes}
    </>
  )
}

export default App
