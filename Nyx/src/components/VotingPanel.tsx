// src/components/VotingPanel.tsx
import React from 'react';

interface Option {
    id: number;
    option_text: string;
    votes: number;
}

interface VotingPanelProps {
    options: Option[];
    onVote: (optionId: number) => void;
}

const VotingPanel: React.FC<VotingPanelProps> = ({ options, onVote }) => {
    return (
        <div className="voting-panel">
            {options.map((option) => (
                <button key={option.id} className="vote-button" onClick={() => onVote(option.id)}>
                    <span>{option.option_text}</span>
                    <div className="vote-count">Votes: {option.votes}</div>
                </button>
            ))}
        </div>
    );
};

export default VotingPanel;
