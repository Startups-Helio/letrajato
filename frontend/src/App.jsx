import React from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
import Home from "./pages/Home"
import LandingPage from "./pages/LandingPage"
import ProtectedRoute from "./components/ProtectedRoute"
import Orcamento from "./pages/Orcamento"

function Logout(){
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register />
}

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/orcamento" element = {<Orcamento />}/>
        <Route path="/login" element = {<Login />}/>
        <Route path="/logout" element = {<Logout />}/>
        <Route path="/register" element = {<Register />}/>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  )
}

export default App
