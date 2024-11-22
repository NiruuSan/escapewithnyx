import React from 'react';
import styled from 'styled-components';

const VotingPanelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 20px;
  flex-wrap: wrap;
`;

const VoteButton = styled.button`
  background-color: #151515;
  color: #e0e0e0;
  padding: 15px 20px;
  border-radius: 10px;
  border: solid 5px #1E1E1E;
  cursor: pointer;
  font-family: "Silkscreen", sans-serif;
  font-size: 1rem;
  width: 250px;
  text-align: center;
  position: relative;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #3a3a3a;
    transform: scale(1.05);
  }
`;

const OptionTitle = styled.div`
  font-size: 1rem;
  color: #ffffff;
  margin-bottom: 5px;
`;

const VoteCount = styled.div`
  font-size: 0.85rem;
  color: #bbbbbb;
`;

const VotingPanel = ({ options, onVote }) => {
  const handleVoteClick = async (optionId) => {
    try {
      const response = await fetch('http://localhost:5000/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Envoie les cookies pour identifier l'utilisateur
        body: JSON.stringify({ optionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record vote.');
      }

      console.log(`Vote successfully recorded for option ID: ${optionId}`);
    } catch (error) {
      console.error('Error recording vote:', error.message);
    }
  };

  return (
    <VotingPanelContainer>
      {Array.isArray(options) && options.length > 0 ? (
        options.map((option) => (
          <VoteButton
            key={option.id}
            onClick={() => handleVoteClick(option.id)}
          >
            <OptionTitle>{option.message_content}</OptionTitle>
            <VoteCount>{option.votes} votes</VoteCount>
          </VoteButton>
        ))
      ) : (
        <p style={{ color: '#ffffff', fontFamily: "Silkscreen, sans-serif" }}>
          No voting options available.
        </p>
      )}
    </VotingPanelContainer>
  );
};

export default VotingPanel;
