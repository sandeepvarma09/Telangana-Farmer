import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessageBubble from '../components/ChatMessageBubble';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChatMessage, GroundingChunk, Language } from '../types'; // Added Language
import { useLanguage } from '../hooks/useLanguage';
import useVoiceInput from '../hooks/useVoiceInput';
import { GeminiService } from '../services/geminiService';
import { MicIcon, SendIcon } from '../components/icons/CoreIcons';
import { CHATBOT_NAME, CHATBOT_INITIAL_MESSAGE_KEY, CHATBOT_SUGGESTED_QUESTION_1_KEY, CHATBOT_SUGGESTED_QUESTION_2_KEY, CHATBOT_SUGGESTED_QUESTION_3_KEY, MAX_CHAT_HISTORY } from '../constants';


const ChatbotPage: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const geminiService = useRef(new GeminiService()).current;

  const getVoiceLang = () => {
    switch (currentLanguage) {
      case Language.Telugu:
        return 'te-IN';
      case Language.Hindi:
        return 'hi-IN';
      case Language.English:
      default:
        return 'en-US';
    }
  };
  const { transcript, isListening, startListening, stopListening, isSupported: voiceSupported, error: voiceError, resetTranscript } = useVoiceInput(getVoiceLang());

  useEffect(() => {
    // Add initial greeting message from AI
    setMessages([
      {
        id: uuidv4(),
        text: t(CHATBOT_INITIAL_MESSAGE_KEY),
        sender: 'ai',
        timestamp: new Date(),
      }
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, currentLanguage]); // Re-run if language changes to get initial message in new lang

  useEffect(() => {
    if (transcript) {
      setNewMessage(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    resetTranscript();
    setIsLoading(true);
    setError(null);

    try {
      const chatHistory = messages.slice(-MAX_CHAT_HISTORY);
      const { text: aiResponseText, groundingChunks } = await geminiService.generateContent(text.trim(), chatHistory, currentLanguage); // Pass currentLanguage

      const aiMessage: ChatMessage = {
        id: uuidv4(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
        sources: groundingChunks // Pass sources here
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (e: any) {
      console.error("Error sending message to Gemini:", e);
      setError(t('errorFetchingResponse') + (e.message ? `: ${e.message}` : ''));
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        text: t('errorFetchingResponse'),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geminiService, messages, t, resetTranscript, currentLanguage]);


  const handleSuggestedQuestion = (questionKey: string) => {
    handleSendMessage(t(questionKey));
  };

  const suggestedQuestions = [
    CHATBOT_SUGGESTED_QUESTION_1_KEY,
    CHATBOT_SUGGESTED_QUESTION_2_KEY,
    CHATBOT_SUGGESTED_QUESTION_3_KEY,
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-inner"> {/* Changed height to h-full */}
      <header className="bg-primary text-white p-3 sm:p-4 rounded-t-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold text-center">{t('chatbotName')}</h2>
      </header>

      <div className="flex-grow p-3 sm:p-4 space-y-4 overflow-y-auto">
        {messages.map(msg => (
          <ChatMessageBubble key={msg.id} message={msg} sources={msg.sources} />
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <LoadingSpinner size="sm" />
          </div>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className="p-2 sm:p-3 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 text-center">{t('chatbotQuickQuestions')}</p>
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {suggestedQuestions.map(qKey => (
              <button
                key={qKey}
                onClick={() => handleSuggestedQuestion(qKey)}
                className="bg-primary-light/30 text-primary-dark hover:bg-primary-light/50 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full transition-colors"
              >
                {t(qKey)}
              </button>
            ))}
          </div>
        </div>
      )}

      {voiceError && <p className="text-red-500 text-xs text-center px-2 py-1">{voiceError}</p>}

      <div className="border-t border-gray-200 p-2 sm:p-3 bg-white rounded-b-lg shadow- ऊपर">
        <div className="flex items-center space-x-2">
          {voiceSupported && (
             <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full focus:outline-none transition-colors ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={t('voiceInput')}
              >
              <MicIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (handleSendMessage(newMessage), e.preventDefault())}
            placeholder={isListening ? t('listening') : t('inputPlaceholder')}
            className="flex-grow p-2 sm:p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-sm sm:text-base"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(newMessage)}
            disabled={isLoading || !newMessage.trim()}
            className="bg-primary hover:bg-primary-dark text-white p-2 sm:p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50 transition-colors"
            title={t('sendMessage')}
          >
            <SendIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;