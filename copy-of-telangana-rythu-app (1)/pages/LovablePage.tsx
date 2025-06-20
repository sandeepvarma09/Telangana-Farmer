
import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../hooks/useLanguage';
import { CivicIssue, IssueCategory, IssueStatus, CivicIssueComment } from '../types';
import { getMockCivicIssues } from '../services/mockData';
import ReportIssueForm from '../components/lovable/ReportIssueForm';
import IssueListItem from '../components/lovable/IssueListItem';
import IssueDetailModal from '../components/lovable/IssueDetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { FilterIcon } from '../components/icons/CoreIcons';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '../constants';

type LovableTab = 'report' | 'view';
type CategoryFilter = IssueCategory | 'all';
type StatusFilter = IssueStatus | 'all';


const LovablePage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<LovableTab>('view');
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFilters, setShowFilters] = useState(false);


  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIssues(getMockCivicIssues(t));
      setIsLoading(false);
    }, 500);
  }, [t]);

  const handleIssueReported = (newIssueData: Omit<CivicIssue, 'id' | 'submittedBy' | 'submittedAt' | 'upvotes' | 'comments' | 'status'> & { imageFile?: File }) => {
    const newIssue: CivicIssue = {
      ...newIssueData,
      id: uuidv4(),
      submittedBy: "Current User", // Replace with actual user later
      submittedAt: new Date(),
      upvotes: 0,
      comments: [],
      status: IssueStatus.Open,
      imageUrl: newIssueData.imageFile ? URL.createObjectURL(newIssueData.imageFile) : newIssueData.imageUrl,
    };
    setIssues(prevIssues => [newIssue, ...prevIssues]);
    setActiveTab('view'); // Switch to view tab after reporting
    // Optionally, clear the imageFile from memory if it was a blob URL
    // if (newIssue.imageUrl && newIssue.imageUrl.startsWith('blob:')) {
    //   URL.revokeObjectURL(newIssue.imageUrl);
    // }
  };

  const handleUpvote = (issueId: string) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId ? { ...issue, upvotes: issue.upvotes + 1 } : issue
      )
    );
    if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(prev => prev ? {...prev, upvotes: prev.upvotes + 1} : null);
    }
  };

  const handleAddComment = (issueId: string, commentText: string) => {
    const newComment: CivicIssueComment = {
      id: uuidv4(),
      userName: "Current User", // Replace with actual user later
      text: commentText,
      timestamp: new Date(),
    };
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId ? { ...issue, comments: [...issue.comments, newComment] } : issue
      )
    );
    if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(prev => prev ? {...prev, comments: [...prev.comments, newComment]} : null);
    }
  };

  const openIssueModal = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (issue) setSelectedIssue(issue);
  };

  const closeIssueModal = () => {
    setSelectedIssue(null);
  };

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
      return matchesCategory && matchesStatus;
    });
  }, [issues, categoryFilter, statusFilter]);

  const issueCategories = Object.values(IssueCategory);
  const issueStatuses = Object.values(IssueStatus);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('lovablePageTitle')}</h2>
      </div>

      <div className="flex justify-center space-x-2 sm:space-x-4 bg-gray-200 p-1 rounded-lg sticky top-[60px] z-30 -mx-4 px-4 shadow-sm mb-6">
        <button
          onClick={() => setActiveTab('view')}
          className={`px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-colors duration-150 w-1/2
            ${activeTab === 'view' ? 'bg-primary text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'}`}
          aria-pressed={activeTab === 'view'}
        >
          {t('viewIssuesTab')}
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-colors duration-150 w-1/2
            ${activeTab === 'report' ? 'bg-primary text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'}`}
          aria-pressed={activeTab === 'report'}
        >
          {t('reportIssueTab')}
        </button>
      </div>

      {activeTab === 'view' && (
        <>
          <div className="mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full sm:w-auto sm:float-right bg-white text-primary border border-primary px-4 py-2 rounded-lg shadow hover:bg-primary-light/10 transition-colors mb-2"
              aria-expanded={showFilters}
            >
              <FilterIcon className="w-5 h-5 mr-2" />
              {t('filterBy')} ({showFilters ? t('cancel') : t('settings')})
            </button>
            <div className="clear-both"></div>
           {showFilters && (
             <div className="bg-white p-4 rounded-lg shadow-md mt-2 space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                <div>
                  <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">{t('filterByCategory')}</label>
                  <select
                    id="categoryFilter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  >
                    <option value="all">{t('all')}</option>
                    {issueCategories.map(cat => (
                      <option key={cat} value={cat}>{t(`category${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">{t('filterByStatus')}</label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  >
                    <option value="all">{t('all')}</option>
                    {issueStatuses.map(stat => (
                      <option key={stat} value={stat}>{t(`status${stat.charAt(0).toUpperCase() + stat.slice(1)}`)}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner text={t('loading')} />
            </div>
          ) : filteredIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIssues.map(issue => (
                <IssueListItem
                  key={issue.id}
                  issue={issue}
                  onViewDetails={() => openIssueModal(issue.id)}
                  onUpvote={() => handleUpvote(issue.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-10 text-lg">{t('noIssuesFoundLovable')}</p>
          )}
        </>
      )}

      {activeTab === 'report' && (
        <ReportIssueForm onSubmit={handleIssueReported} />
      )}

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          isOpen={!!selectedIssue}
          onClose={closeIssueModal}
          onUpvote={() => handleUpvote(selectedIssue.id)}
          onAddComment={(commentText) => handleAddComment(selectedIssue.id, commentText)}
        />
      )}
    </div>
  );
};

export default LovablePage;
