import React, { useEffect, useState, useRef } from 'react';
import peer from '@/service/peer';
import Picker from 'emoji-picker-react';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef();

  // Receive messages
  useEffect(() => {
    peer.onMessage(msg => {
      setMessages(prev => [...prev, { sender: 'remote', text: msg }]);
    });
  }, []);

  // Auto-scroll newest
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = e => {
    e.preventDefault();
    const txt = input.trim();
    if (!txt) return;
    peer.sendMessage(txt);
    setMessages(prev => [...prev, { sender: 'me', text: txt }]);
    setInput('');
  };

  const onEmojiClick = (_, emojiData) => {
    setInput(i => i + emojiData.emoji);
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 max-h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col z-20">
      <div className="bg-blue-600 text-white px-4 py-2 rounded-t-xl font-semibold">
        Chat
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[70%] break-words ${
                m.sender === 'me'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="relative border-t border-gray-300 dark:border-gray-600 px-2 py-1 flex items-center gap-2">
        {showEmojiPicker && (
          <div className="absolute -top-48 right-2 z-30">
            <Picker onEmojiClick={onEmojiClick} disableSearchBar disableSkinTonePicker />
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(v => !v)}
          className="text-xl"
        >
          😊
        </button>
        <form onSubmit={handleSend} className="flex flex-1 gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-green-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full font-medium transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
