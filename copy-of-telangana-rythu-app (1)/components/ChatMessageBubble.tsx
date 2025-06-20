
import React from 'react';
import { ChatMessage, GroundingChunk } from '../types';
import { UserIcon, SparklesIcon } from './icons/CoreIcons'; // Sparkles for AI
import { useLanguage } from '../hooks/useLanguage';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  sources?: GroundingChunk[];
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, sources }) => {
  const { t } = useLanguage();
  const isUser = message.sender === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {isUser ? (
          <UserIcon className="w-6 h-6 rounded-full bg-accent text-white p-1 ml-2 self-start flex-shrink-0" />
        ) : (
          <SparklesIcon className="w-6 h-6 rounded-full bg-primary text-white p-1 mr-2 self-start flex-shrink-0" />
        )}
        <div
          className={`p-3 rounded-lg ${
            isUser ? 'bg-accent text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
          } shadow-md`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          {message.sender === 'ai' && sources && sources.length > 0 && (
             <div className="mt-2 pt-2 border-t border-gray-300">
                <p className="text-xs font-semibold mb-1">{t('searchSources')}</p>
                <ul className="list-disc list-inside">
                    {sources.map((source, index) => {
                        const uri = source.web?.uri || source.retrievedContext?.uri;
                        const title = source.web?.title || source.retrievedContext?.title || uri;
                        if (uri) {
                            return (
                                <li key={index} className="text-xs">
                                    <a href={uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                        {title || uri}
                                    </a>
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
             </div>
          )}
          <p className={`text-xs mt-1 ${isUser ? 'text-blue-200 text-right' : 'text-gray-500 text-left'}`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBubble;
