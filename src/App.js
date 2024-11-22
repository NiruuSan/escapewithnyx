import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminPage from './AdminPage';
import LoginPage from './LoginPage';
import HomePage from './HomePage'; // Assurez-vous que la homepage est importée

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-admin', {
          credentials: 'include', // Nécessaire pour inclure les cookies
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification admin :', error);
        setIsAuthenticated(false);
      }
    };

    checkAdmin();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {/* Route pour la homepage */}
        <Route path="/" element={<HomePage />} />

        {/* Route pour la page admin */}
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />}
        />

        {/* Route pour la page de connexion */}
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />

        {/* Redirection par défaut vers la homepage */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
