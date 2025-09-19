import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { chatbotAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChatMessage } from '../../types';

export const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: language === 'or' 
        ? `ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର FarmLedger ସହାୟକ। ମୁଁ ଆପଣଙ୍କୁ ଉତ୍ପାଦ ପଞ୍ଜୀକରଣ, QR କୋଡ, ପେମେଣ୍ଟ ଏବଂ ଯୋଗାଣ ଶୃଙ୍ଖଳା ପ୍ରଶ୍ନରେ ସାହାଯ୍ୟ କରିପାରିବି। ଆଜି ମୁଁ କିପରି ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିପାରିବି?`
        : `Hello! I'm your FarmLedger assistant. I can help you with product registration, QR codes, payments, and supply chain queries. How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      let response;
      if (language === 'or') {
        // Odia responses
        const odiaResponses = [
          "ମୁଁ କୃଷି ଯୋଗାଣ ଶୃଙ୍ଖଳା, ଉତ୍ପାଦ ପଞ୍ଜୀକରଣ ଏବଂ ବ୍ଲକଚେନ ଯାଞ୍ଚ ବିଷୟରେ ସୂଚନା ସହିତ ସାହାଯ୍ୟ କରିପାରିବି।",
          "ଉତ୍ପାଦ ପଞ୍ଜୀକରଣ ପାଇଁ, ଦୟାକରି 'Register Product' ବିଭାଗକୁ ଯାଆନ୍ତୁ ଏବଂ ସମସ୍ତ ଆବଶ୍ୟକ ବିବରଣୀ ପୂରଣ କରନ୍ତୁ।",
          "QR କୋଡ ଉତ୍ପାଦର ସତ୍ୟତା ଯାଞ୍ଚ କରିବାରେ ସାହାଯ୍ୟ କରେ। ଆପଣଙ୍କ ଉତ୍ପାଦ ପଞ୍ଜୀକରଣ କରିବା ପରେ ଆପଣ ସେଗୁଡିକ ତିଆରି କରିପାରିବେ।",
          "MSP (ସର୍ବନିମ୍ନ ସହାୟତା ମୂଲ୍ୟ) ହାର ନିୟମିତ ଅପଡେଟ ହୁଏ। ବର୍ତ୍ତମାନର ହାର ପାଇଁ MSP Status ବିଭାଗ ଦେଖନ୍ତୁ।",
          "ପେମେଣ୍ଟ ସମସ୍ୟା ପାଇଁ, ଦୟାକରି ଆମର ସପୋର୍ଟ ଟିମ୍ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ କିମ୍ବା Payment Gateway ବିଭାଗ ଦେଖନ୍ତୁ।",
        ];
        response = odiaResponses[Math.floor(Math.random() * odiaResponses.length)];
      } else {
        response = await chatbotAPI.sendMessage(inputMessage, user.id);
      }
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    language === 'or' ? "ମୁଁ କିପରି ଉତ୍ପାଦ ପଞ୍ଜୀକରଣ କରିବି?" : "How do I register a product?",
    language === 'or' ? "QR କୋଡ କିପରି ତିଆରି କରିବି?" : "How to generate QR codes?",
    language === 'or' ? "MSP ହାର କ'ଣ?" : "What is MSP rate?",
    language === 'or' ? "ପେମେଣ୍ଟ ଗେଟୱେ ସାହାଯ୍ୟ" : "Payment gateway help",
    language === 'or' ? "KYC ଯାଞ୍ଚ ପ୍ରକ୍ରିୟା" : "KYC verification process",
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center justify-center z-50"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-72 sm:w-80 h-16' : 'w-80 sm:w-96 h-[500px] sm:h-[600px]'
    }`}>
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
<<<<<<< HEAD
              <h3 className="font-semibold text-sm sm:text-base">FarmLegder Assistant</h3>
=======
              <h3 className="font-semibold text-sm sm:text-base">FarmLedger Assistant</h3>
>>>>>>> 22710c20db4c6334685496dd62d1741b1701e921
              <p className="text-xs opacity-90 hidden sm:block">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-1 sm:space-x-2 max-w-[85%] sm:max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.role === 'user' ? <User className="w-3 h-3 sm:w-4 sm:h-4" /> : <Bot className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </div>
                    <div className={`p-2 sm:p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-xs sm:text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-1 sm:space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-3 sm:px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-3 py-1 rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-gray-200">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-blue-600 text-white p-1.5 sm:p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};