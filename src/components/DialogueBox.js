import React from 'react';
import styled from 'styled-components';
import nyxAvatar from '../assets/nyxAvatar.png';

const DialogueContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 20px 0;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: solid 5px #1e1e1e;
  margin-right: 14px;
`;

const MessageBubble = styled.div`
  background-color: #151515;
  color: #e0e0e0;
  padding: 15px;
  border-radius: 15px;
  border: solid 5px #1e1e1e;
  max-width: 80%;
  font-size: 1rem;
  line-height: 1.4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const HighlightedMessage = styled.div`
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: thin;
  text-align: center;
`;

const DialogueBox = ({ message, type }) => {
  if (type === 'highlighted') {
    return <HighlightedMessage>{message}</HighlightedMessage>;
  }

  return (
    <DialogueContainer>
      <Avatar src={nyxAvatar} alt="Nyx Avatar" />
      <MessageBubble>{message}</MessageBubble>
    </DialogueContainer>
  );
};

export default DialogueBox;
