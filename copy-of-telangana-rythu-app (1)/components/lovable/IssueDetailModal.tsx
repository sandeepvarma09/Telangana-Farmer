
import React, { useState } from 'react';
import { CivicIssue, IssueStatus, CivicIssueComment } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { XMarkIcon, ThumbsUpIcon, PaperAirplaneIcon, MapPinIcon, TagIcon, CalendarDaysIcon, UserIcon, CheckCircleIcon, ClockIcon, InformationCircleIcon } from '../icons/CoreIcons'; // Assuming more icons might be needed

interface IssueDetailModalProps {
  issue: CivicIssue;
  isOpen: boolean;
  onClose: () => void;
  onUpvote: (issueId: string) => void;
  onAddComment: (issueId: string, commentText: string) => void;
}

const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, isOpen, onClose, onUpvote, onAddComment }) => {
  const { t } = useLanguage();
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(issue.id, newComment.trim());
      setNewComment('');
    }
  };

  const getStatusChip = (status: IssueStatus) => {
    let colorClasses = '';
    let IconComponent = InformationCircleIcon; // Default icon
    switch (status) {
      case IssueStatus.Open:
        colorClasses = 'bg-yellow-100 text-yellow-800 border-yellow-400';
        IconComponent = ClockIcon;
        break;
      case IssueStatus.InProgress:
        colorClasses = 'bg-blue-100 text-blue-800 border-blue-400';
        IconComponent = ClockIcon; // Or a specific "in progress" icon
        break;
      case IssueStatus.Resolved:
        colorClasses = 'bg-green-100 text-green-800 border-green-400';
        IconComponent = CheckCircleIcon;
        break;
      case IssueStatus.Rejected:
        colorClasses = 'bg-red-100 text-red-800 border-red-400';
        IconComponent = XMarkIcon; // Re-using XMark for rejection status icon
        break;
      default:
        colorClasses = 'bg-gray-100 text-gray-800 border-gray-400';
    }
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full border inline-flex items-center ${colorClasses}`}>
        <IconComponent className="w-4 h-4 mr-1.5" />
        {t(`status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
      </span>
    );
  };
  
  const categoryText = t(`category${issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}`);
  const formattedDate = new Date(issue.submittedAt).toLocaleDateString(t('currentLanguage') === 'telugu' ? 'te-IN' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="issueDetailModalTitle"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 id="issueDetailModalTitle" className="text-xl font-semibold text-gray-800 truncate" title={issue.title}>
            {issue.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            aria-label={t('close')}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {issue.imageUrl && (
            <img 
              src={issue.imageUrl} 
              alt={issue.title} 
              className="w-full max-h-72 object-contain rounded-md border border-gray-200 mb-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.alt = t('noPhotoAvailable');
                target.style.display = 'none'; // Or show a placeholder
              }}
            />
          )}
          {!issue.imageUrl && <p className="text-sm text-gray-500 text-center py-4">{t('noPhotoAvailable')}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start">
              <MapPinIcon className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <div><strong className="text-gray-600">{t('location')}:</strong> {issue.location.text}</div>
            </div>
            <div className="flex items-start">
              <TagIcon className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <div><strong className="text-gray-600">{t('category')}:</strong> {categoryText}</div>
            </div>
            <div className="flex items-start">
              <UserIcon className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <div><strong className="text-gray-600">{t('submittedBy')}:</strong> {issue.submittedBy}</div>
            </div>
            <div className="flex items-start">
              <CalendarDaysIcon className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <div><strong className="text-gray-600">{t('submittedOn')}:</strong> {formattedDate}</div>
            </div>
          </div>
          
          <div className="text-center my-3">{getStatusChip(issue.status)}</div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-1">{t('issueDescriptionLabel')}:</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <button
              onClick={() => onUpvote(issue.id)}
              className="flex items-center text-primary hover:text-primary-dark font-medium px-3 py-1.5 rounded-md hover:bg-primary-light/20 transition-colors"
              aria-label={`${t('upvote')} this issue`}
            >
              <ThumbsUpIcon className="w-5 h-5 mr-1.5" /> {t('upvote')} ({issue.upvotes})
            </button>
            <span className="text-gray-600">{t('commentsTitle')} ({issue.comments.length})</span>
          </div>

          {/* Comments Section */}
          <div className="space-y-3 max-h-60 overflow-y-auto bg-gray-50 p-3 rounded-md">
            {issue.comments.length > 0 ? (
              issue.comments.map(comment => (
                <div key={comment.id} className="bg-white p-2.5 rounded shadow-sm border border-gray-200">
                  <p className="text-xs text-gray-500 mb-0.5">
                    <strong>{comment.userName}</strong> - {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">{t('noCommentsYet', 'No comments yet.')}</p> 
            )}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-start space-x-2 pt-3 border-t border-gray-200">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t('addCommentPlaceholder')}
              rows={2}
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              aria-label={t('addCommentPlaceholder')}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-3 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-60 transition-colors"
              aria-label={t('postCommentButton')}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};
// Add t('noCommentsYet', 'No comments yet.') to translations
export default IssueDetailModal;
