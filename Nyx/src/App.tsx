// src/App.tsx
import React, { useEffect, useState } from 'react';
import DialogueBox from './components/DialogueBox';
import VotingPanel from './components/VotingPanel';
import headerImage from './assets/headerImage.png';
import './App.css';

interface Message {
    id: number;
    content: string;
}

interface Option {
    id: number;
    option_text: string;
    votes: number;
}

const App: React.FC = () => {
    const [conversation, setConversation] = useState<Message[]>([]);
    const [voteOptions, setVoteOptions] = useState<Option[]>([]);

    useEffect(() => {
        // Simulation de récupération des données
        setConversation([{ id: 1, content: "Hello! Can anyone hear me? I think I'm trapped in here..." }]);
        setVoteOptions([
            { id: 1, option_text: "Hello? What do you mean you're trapped?", votes: 0 },
            { id: 2, option_text: "Hello? Who are you?", votes: 0 },
        ]);
    }, []);

    const handleVote = (optionId: number) => {
        // Logique de vote (à implémenter)
        console.log(`Vote pour l'option ${optionId}`);
    };

    return (
        <div>
            <div className="header-container">
                <div className="header-glow" style={{ backgroundImage: `url(${headerImage})` }} />
                <img src={headerImage} alt="Header" className="header-image" />
            </div>
            <div className="dialogue-container">
                {conversation.map((dialogue) => (
                    <DialogueBox key={dialogue.id} message={dialogue.content} />
                ))}
            </div>
            <div className="voting-container">
                <VotingPanel options={voteOptions} onVote={handleVote} />
            </div>
        </div>
    );
};

export default App;
