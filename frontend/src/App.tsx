import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import UserProvider from the correct location
import { UserProvider } from "./pages/UserContext";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import HeroSection from "./pages/HeroSection";

function App() {
  // Lógica para verificar se o usuário está autenticado (ex: checando o token)
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <div className="bg-brand-dark text-slate-300 min-h-screen font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-slate to-brand-dark overflow-x-hidden">
      <Toaster position="top-center" />
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route
            path="/welcome"
            element={!isAuthenticated ? <HeroSection /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/register"
            element={<RegisterPage setIsAuthenticated={setIsAuthenticated} />}
          />

          {/* Rota Raiz e Protegida com o UserProvider */}
          <Route
            path="/*" // Captura a rota raiz e qualquer outra rota protegida
            element={
              isAuthenticated ? (
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <UserProvider>
                    <Dashboard onLogout={handleLogout} />
                  </UserProvider>
                </ProtectedRoute>
              ) : (
                <Navigate to="/welcome" replace />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
