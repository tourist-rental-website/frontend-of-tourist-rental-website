import { useState } from 'react';

export const useWebSocket = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [readyStatus, setReadyStatus] = useState('CONNECTING');
  const sendMessage = () => {};

  return {
    messages,
    setMessages,
    readyStatus,
    sendMessage,
  };
};

export default useWebSocket;
