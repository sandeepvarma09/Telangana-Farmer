
import React, { useState, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { CivicIssue, IssueCategory } from '../../types';
import { CameraIcon, TrashIcon } from '../icons/CoreIcons'; 
import { ISSUE_CATEGORIES } from '../../constants';

interface ReportIssueFormProps {
  onSubmit: (data: Omit<CivicIssue, 'id' | 'submittedBy' | 'submittedAt' | 'upvotes' | 'comments' | 'status'> & { imageFile?: File }) => void;
}

const ReportIssueForm: React.FC<ReportIssueFormProps> = ({ onSubmit }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>(IssueCategory.Other);
  const [locationText, setLocationText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !description || !locationText) {
      alert(t('fillAllFieldsError', 'Please fill all required fields.')); // Add translation key
      return;
    }
    onSubmit({
      title,
      description,
      category,
      location: { text: locationText },
      imageFile: imageFile || undefined, // Send undefined if no file
      // imageUrl will be handled by parent if imageFile is present
    });
    // Reset form
    setTitle('');
    setDescription('');
    setCategory(IssueCategory.Other);
    setLocationText('');
    removeImage();
  };
  
  const issueCategories = Object.values(IssueCategory);


  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">{t('reportNewIssueTitle')}</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="issueTitle" className="block text-sm font-medium text-gray-700 mb-1">{t('issueTitleLabel')} <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="issueTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('issueTitlePlaceholder')}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700 mb-1">{t('issueDescriptionLabel')} <span className="text-red-500">*</span></label>
          <textarea
            id="issueDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('issueDescriptionPlaceholder')}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="issueCategory" className="block text-sm font-medium text-gray-700 mb-1">{t('issueCategoryLabel')} <span className="text-red-500">*</span></label>
          <select
            id="issueCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value as IssueCategory)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {issueCategories.map(cat => (
                 <option key={cat} value={cat}>{t(`category${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="issueLocation" className="block text-sm font-medium text-gray-700 mb-1">{t('issueLocationLabel')} <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="issueLocation"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            placeholder={t('issueLocationPlaceholder')}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('issuePhotoLabel')}</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
                id="imageUpload"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
                <CameraIcon className="w-5 h-5 mr-2" />
                {t(imageFile ? 'changePhotoButton' : 'attachPhoto')}
            </button>

            {imagePreview && (
            <div className="mt-4 relative">
                <p className="text-sm font-medium text-gray-700 mb-1">{t('photoPreview')}:</p>
                <img src={imagePreview} alt={t('photoPreview')} className="w-full max-h-60 object-contain rounded-md border border-gray-300" />
                <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                    aria-label={t('removePhoto')}
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
            )}
        </div>


        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary-light transition-colors duration-150"
        >
          {t('submitIssueButton')}
        </button>
      </form>
    </div>
  );
};

// Add new translation keys used if not present
// t('fillAllFieldsError', 'Please fill all required fields.')
// t('changePhotoButton', 'Change Photo')

export default ReportIssueForm;
