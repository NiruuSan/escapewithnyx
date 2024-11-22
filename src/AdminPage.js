import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function AdminPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState('default'); // Nouveau champ pour le type de message
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(null);

  // Pour les messages de vote
  const [votingOption1, setVotingOption1] = useState('');
  const [votingOption2, setVotingOption2] = useState('');

  // Charger les messages existants et les rounds
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const fetchActiveRound = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/active-round');
        const data = await response.json();
        setCurrentRound(data.activeRound || null);
      } catch (error) {
        console.error('Error fetching active round:', error);
      }
    };

    fetchMessages();
    fetchActiveRound();
  }, []);

  

  // Ajouter un nouveau message avec type
  const handleAddMessage = async () => {
    if (!newMessage.trim()) {
      alert('Le contenu du message est requis.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage, type: messageType }), // Envoi du type
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Échec de l\'ajout du message');
      }
  
      const addedMessage = await response.json();
      setMessages([...messages, addedMessage]); // Ajoute le message reçu
      setNewMessage(''); // Réinitialise le champ de saisie
      setMessageType('default'); // Réinitialise le type par défaut
    } catch (error) {
      console.error('Erreur lors de l\'ajout du message :', error);
      alert('Impossible d\'ajouter le message. Veuillez réessayer.');
    }
  };
  
  

  // Lancer un nouveau round
  const handleStartRound = async () => {
    try {
      if (currentRound) {
        alert('Un round est déjà en cours. Veuillez le fermer avant d’en lancer un nouveau.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/votingrounds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const newRound = await response.json();
        setRounds([...rounds, newRound]);
        setCurrentRound(newRound);
        alert('Nouveau round lancé avec succès !');
      }
    } catch (error) {
      console.error('Error starting round:', error);
    }
  };

  // Fermer le round actuel
  const handleCloseRound = async () => {
    try {
      if (!currentRound) {
        alert("Aucun round en cours à fermer.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/votingrounds/${currentRound.id}/close`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setRounds(
          rounds.map((round) =>
            round.id === currentRound.id ? { ...round, status: 'finished' } : round
          )
        );
        setCurrentRound(null);
        alert('Round fermé avec succès.');
      }
    } catch (error) {
      console.error('Error closing round:', error);
    }
  };

  // Ajouter les options de vote au round actuel
  const handleSetVotingOptions = async () => {
    if (!votingOption1 || !votingOption2 || !currentRound) {
      alert('Veuillez remplir les deux options de vote et vous assurer qu’un round est actif.');
      return;
    }

    try {
      const option1Response = await fetch('http://localhost:5000/api/votingoptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ round_id: currentRound.id, message_content: votingOption1 }),
      });

      const option2Response = await fetch('http://localhost:5000/api/votingoptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ round_id: currentRound.id, message_content: votingOption2 }),
      });

      if (option1Response.ok && option2Response.ok) {
        alert('Les options de vote ont été définies avec succès !');
        setVotingOption1('');
        setVotingOption2('');
      } else {
        alert('Une erreur s’est produite lors de la définition des options de vote.');
      }
    } catch (error) {
      console.error('Error setting voting options:', error);
    }
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include', // Inclut le cookie
      });

      if (response.ok) {
        alert('Déconnexion réussie');
        navigate('/HomePage'); // Redirige vers la page de connexion
      } else {
        alert('Échec de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  const logoutButtonStyle = {
    backgroundColor: '#ff4d4d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '1rem',
  };  
  
  // Bouton dans la page admin
  <button onClick={handleLogout}>Se déconnecter</button>
  

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Panel</h1>

      {/* Gestion des rounds */}
      <section>
        <h2>Gestion des Rounds</h2>
        {currentRound ? (
          <p style={{ color: 'green' }}>Round en cours : {currentRound.id}</p>
        ) : (
          <p style={{ color: 'red' }}>Aucun round en cours.</p>
        )}
        <button onClick={handleStartRound} disabled={!!currentRound}>
          Lancer un nouveau round
        </button>
        <button onClick={handleCloseRound} disabled={!currentRound}>
          Fermer le round actuel
        </button>
      </section>

      {/* Gestion des messages */}
      <section>
        <h2>Messages</h2>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ajouter un nouveau message"
        />
        <select
  value={messageType}
  onChange={(e) => setMessageType(e.target.value)} // Met à jour le type
>
  <option value="default">Default</option>
  <option value="highlighted">Highlighted</option>
</select>
        <button onClick={handleAddMessage}>Ajouter</button>
        <ul>
          {messages.map((message) => (
            <li key={message.id} style={{ color: message.type === 'highlighted' ? 'gold' : 'white' }}>
              {message.content}
            </li>
          ))}
        </ul>
      </section>

      {/* Options de vote */}
      <section>
        <h2>Définir les options de vote</h2>
        <textarea
          value={votingOption1}
          onChange={(e) => setVotingOption1(e.target.value)}
          placeholder="Option de vote 1"
          rows="3"
          style={{ width: '100%' }}
        />
        <textarea
          value={votingOption2}
          onChange={(e) => setVotingOption2(e.target.value)}
          placeholder="Option de vote 2"
          rows="3"
          style={{ width: '100%' }}
        />
        <button onClick={handleSetVotingOptions} disabled={!votingOption1 || !votingOption2 || !currentRound}>
          Définir les options de vote
        </button>
        <button onClick={handleLogout} style={logoutButtonStyle}>
        Déconnexion
        </button>
      </section>
    </div>
  );
}

export default AdminPage;
