'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE = "Bonjour ! 👋 Je suis l'assistant virtuel de DRONEK. Comment puis-je vous aider aujourd'hui ?";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-dronek-green to-dronek-dark shadow-lg shadow-dronek-green/30 flex items-center justify-center text-white hover:shadow-xl hover:shadow-dronek-green/40 transition-shadow cursor-pointer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ouvrir le chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Image src="/images/dronek-nav-icon.png" alt="DRONEK" width={28} height={28} className="rounded" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[70vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden border border-gray-100"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-dronek-green to-dronek-dark text-white px-5 py-4 flex items-center gap-3 rounded-t-2xl shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Image src="/images/dronek-nav-icon.png" alt="DRONEK" width={24} height={24} className="rounded" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base leading-tight">Assistant DRONEK</h3>
                <p className="text-white/70 text-xs mt-0.5">En ligne • Répond dans votre langue</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Fermer le chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 chatbot-scrollbar bg-gray-50/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-dronek-green/10 flex items-center justify-center mr-2 shrink-0 mt-1">
                      <Image src="/images/dronek-nav-icon.png" alt="DRONEK" width={18} height={18} className="rounded" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-dronek-green text-white rounded-2xl rounded-br-md ml-12'
                        : 'bg-gray-100 text-dronek-text rounded-2xl rounded-bl-md mr-12'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-dronek-green flex items-center justify-center ml-2 shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-7 h-7 rounded-full bg-dronek-green/10 flex items-center justify-center mr-2 shrink-0 mt-1">
                    <Image src="/images/dronek-nav-icon.png" alt="DRONEK" width={18} height={18} className="rounded" />
                  </div>
                  <div className="bg-gray-100 text-dronek-text rounded-2xl rounded-bl-md mr-12 px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <motion.span
                        className="w-2 h-2 bg-dronek-medium/60 rounded-full inline-block"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-dronek-medium/60 rounded-full inline-block"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-dronek-medium/60 rounded-full inline-block"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-3 flex gap-2 items-center shrink-0 bg-white rounded-b-2xl">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrivez votre message..."
                disabled={isTyping}
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm text-dronek-text placeholder-dronek-light-text focus:border-dronek-green focus:ring-2 focus:ring-dronek-green/10 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50/50 focus:bg-white"
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-dronek-green text-white flex items-center justify-center hover:bg-dronek-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Envoyer"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot scrollbar styles */}
      <style jsx global>{`
        .chatbot-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .chatbot-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chatbot-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 100px;
        }
        .chatbot-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
}
