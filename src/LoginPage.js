import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Réinitialise l'erreur

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Connexion réussie !');
        onLoginSuccess(); // Met à jour l'état dans App.js
        navigate('/admin'); // Redirige vers la page admin
      } else {
        setError('Nom d\'utilisateur ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setError('Erreur lors de la connexion. Veuillez réessayer.');
    }
  };

  

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>ADMIN LOGIN</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d'utilisateur"
          style={{ padding: '10px', width: '300px', margin: '10px' }}
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          style={{ padding: '10px', width: '300px', margin: '10px' }}
        />
        <br />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Se connecter
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default LoginPage;
