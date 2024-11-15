// src/components/DialogueBox.tsx
import React from 'react';

interface DialogueBoxProps {
    message: string;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ message }) => {
    return (
        <div className="dialogue-box">
            <p>{message}</p>
        </div>
    );
};

export default DialogueBox;
