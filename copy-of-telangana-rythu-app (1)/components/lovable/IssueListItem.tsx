
import React from 'react';
import { CivicIssue, IssueStatus } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { ThumbsUpIcon, ChatBubbleOvalLeftEllipsisIcon, MapPinIcon } from '../icons/CoreIcons';

interface IssueListItemProps {
  issue: CivicIssue;
  onViewDetails: (issueId: string) => void;
  onUpvote: (issueId: string) => void;
}

const IssueListItem: React.FC<IssueListItemProps> = ({ issue, onViewDetails, onUpvote }) => {
  const { t } = useLanguage();

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.Open: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case IssueStatus.InProgress: return 'bg-blue-100 text-blue-800 border-blue-300';
      case IssueStatus.Resolved: return 'bg-green-100 text-green-800 border-green-300';
      case IssueStatus.Rejected: return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const categoryText = t(`category${issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}`);
  const statusText = t(`status${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}`);

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer"
      onClick={() => onViewDetails(issue.id)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onViewDetails(issue.id)}
      aria-label={`${t('viewDetails')} for ${issue.title}`}
    >
      {issue.imageUrl && (
        <img 
          src={issue.imageUrl} 
          alt={issue.title} 
          className="w-full h-40 object-cover" 
          onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(issue.status)}`}>
            {statusText}
          </span>
           <span className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded-full border border-gray-300">
            {categoryText}
          </span>
        </div>

        <h4 className="text-lg font-bold text-gray-800 mb-1 truncate" title={issue.title}>{issue.title}</h4>
        
        <p className="text-xs text-gray-500 mb-2 flex items-center">
          <MapPinIcon className="w-3 h-3 mr-1 flex-shrink-0" /> 
          {issue.location.text}
        </p>
        <p className="text-sm text-gray-700 mb-3 h-10 overflow-hidden text-ellipsis">
          {issue.description}
        </p>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <button
            onClick={(e) => { e.stopPropagation(); onUpvote(issue.id); }}
            className="flex items-center hover:text-primary transition-colors p-1 -ml-1"
            aria-label={`${t('upvote')} issue: ${issue.title}, current upvotes: ${issue.upvotes}`}
          >
            <ThumbsUpIcon className="w-4 h-4 mr-1" /> {issue.upvotes}
          </button>
          <div className="flex items-center">
            <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4 mr-1" /> {issue.comments.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueListItem;
