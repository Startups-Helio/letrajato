import React, {useState, useEffect} from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
import Home from "./pages/Home"
import LandingPage from "./pages/LandingPage"
import ProtectedRoute from "./components/ProtectedRoute"
import Orcamento from "./pages/Orcamento"
import VerifiedRoute from "./components/VerifiedRoute"
import VerificationPending from "./pages/VerificationPending"
import Admin from "./pages/Admin"
import api from "./api" 
import Support from './pages/Support';
import AdminSupport from './pages/AdminSupport';
import TicketDetail from './components/TicketDetail';
import Faq from "./pages/Faq"

function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await api.get('/letrajato/check-admin/');
        setIsAdmin(response.data.is_admin);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? children : <Navigate to="/home" />;
}

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
        <Route path="/orcamento" element = {
            <ProtectedRoute>
              <VerifiedRoute>
                <Orcamento />
              </VerifiedRoute>
            </ProtectedRoute>
        }
        />
        <Route path="/verification-pending" element={
            <ProtectedRoute>
              <VerificationPending />
            </ProtectedRoute>
        }
        />
        <Route path="/login" element = {<Login />}/>
        <Route path="/logout" element = {<Logout />}/>
        <Route path="/register" element = {<Register />}/>
        <Route path="/faq" element = {<Faq />}/>
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminRoute>
              <Admin />
            </AdminRoute>
          </ProtectedRoute>
        }/>
        <Route 
          path="/support" 
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/support/ticket/:ticketId" 
          element={
            <ProtectedRoute>
              <TicketDetail isAdmin={false} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/support/ticket/:ticketId" 
          element={
            <AdminRoute>
              <TicketDetail isAdmin={true} />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  )
}

export default App
