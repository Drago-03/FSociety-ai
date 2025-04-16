import React from 'react';
import { useParams } from 'react-router-dom';

const ChatView: React.FC = () => {
  const { chatId } = useParams();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Chat</h1>
      <p>Chat ID: {chatId}</p>
    </div>
  );
};

export default ChatView;
