import React, { useEffect, useRef, useState, useCallback } from 'react';
import DialogueBox from './components/DialogueBox';
import VotingPanel from './components/VotingPanel';
import headerImage from './assets/headerImage.png';
import './app.css'; // Ajoutez les styles CRT dans ce fichier

function App() {
  const [voteOptions, setVoteOptions] = useState([]);
  const [conversation, setConversation] = useState([]);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectIntervalRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const adjustOpacities = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
  
    const messages = container.querySelectorAll('.message');
  
    messages.forEach((message) => {
      // Vérifie si le message est "highlighted"
      if (message.dataset.type === 'highlighted') {
        // Laisser l'opacité à 1 pour les messages "highlighted"
        message.style.opacity = 1;
        return;
      }
  
      const containerHeight = container.offsetHeight;
      const rect = message.getBoundingClientRect();
      const distanceFromBottom = container.getBoundingClientRect().bottom - rect.bottom;
      const relativePosition = distanceFromBottom / containerHeight;
  
      // Ajuster l’opacité en fonction de la position inversée
      const opacity = Math.max(0, Math.min(1, 1 - relativePosition));
      message.style.opacity = opacity;
    });
  };
  

  const connectWebSocket = useCallback(() => {
    let reconnectAttempts = 0;

    const connect = () => {
      const ws = new WebSocket('ws://localhost:5000');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts = 0;
        if (reconnectIntervalRef.current) {
          clearTimeout(reconnectIntervalRef.current);
          reconnectIntervalRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'votingoptions') {
          setVoteOptions(data.payload);
        } else if (data.type === 'messages') {
          setConversation((prev) => [...prev, ...data.payload.reverse()]);
          scrollToBottom();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed. Attempting to reconnect...');
        reconnectAttempts++;
        reconnectIntervalRef.current = setTimeout(connect, Math.min(1000 * reconnectAttempts, 30000));
      };
    };

    connect();
  }, []);

  useEffect(() => {
    connectWebSocket();

    const fetchInitialData = async () => {
      try {
        const [messagesResponse, optionsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/messages'),
          fetch('http://localhost:5000/api/votingoptions'),
        ]);

        const messages = await messagesResponse.json();
        const options = await optionsResponse.json();

        setConversation(messages.reverse());
        setVoteOptions(options);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
      }
    };
  }, [connectWebSocket]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', adjustOpacities);
    }

    adjustOpacities();
    scrollToBottom();

    return () => {
      if (container) {
        container.removeEventListener('scroll', adjustOpacities);
      }
    };
  }, [conversation]);

  return (
    <div
      className="crt-effect"
      style={{
        position: 'absolute', // Position absolue pour occuper tout l'écran
        top: 0,
        left: 0,
        width: '100vw', // Occupe toute la largeur de la fenêtre
        height: '100vh', // Occupe toute la hauteur visible
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          margin: '59px 0',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundImage: `url(${headerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(25px)',
            width: '42%',
            height: '105%',
            position: 'absolute',
            zIndex: 0,
            opacity: 0.5,
            borderRadius: '20px',
          }}
          aria-hidden="true"
        />
        <img
          src={headerImage}
          alt="Header"
          style={{
            width: '40%',
            border: 'solid 10px #1e1e1e80',
            borderRadius: '20px',
            position: 'relative',
            zIndex: 1,
          }}
        />
      </div>
  
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div
  ref={messagesContainerRef}
  style={{
    position: 'relative',
    width: '80%',
    maxWidth: '800px',
    height: '300px',
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    scrollbarWidth: 'none',
  }}
>
  {Array.isArray(conversation) && conversation.length > 0 ? (
    conversation.map((dialogue, index) => (
      <div
        key={index}
        className="message"
        style={{
          color: dialogue.type === 'highlighted' ? 'gold' : 'white',
          fontWeight: dialogue.type === 'highlighted' ? 'bold' : 'normal',
          opacity: conversation.length === 1
            ? 1
            : (dialogue.type === 'highlighted' ? 0.8 : 1), // Correction ici
        }}
      >
        {dialogue.type === 'highlighted' ? (
          <div
            style={{
              fontSize: '1rem',
              textAlign: 'center',
              margin: '10px 0px',
            }}
          >
            {dialogue.content}
          </div>
        ) : (
          <DialogueBox message={dialogue.content} />
        )}
      </div>
    ))
  ) : (
    <p style={{ color: '#ffffff', fontFamily: 'Silkscreen, sans-serif' }}>
      No conversation data available.
    </p>
  )}
  <div ref={messagesEndRef} />
</div>
      </div>
  
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <VotingPanel options={voteOptions} onVote={(id) => console.log(`Voted for: ${id}`)} />
      </div>
    </div>
  );
  
  
  
  
}

export default App;
