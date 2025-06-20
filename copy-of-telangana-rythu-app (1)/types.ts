export enum Language {
  Telugu = 'telugu',
  English = 'english',
  Hindi = 'hindi', // Added Hindi
}

export interface WeatherInfo {
  temperature: number;
  condition: string; // e.g., "Sunny", "Cloudy", "Rain expected"
  icon: React.ElementType; // SVG component for weather
  forecast: { day: string; temp: string; icon: React.ElementType }[]; // 3-day forecast
}

export interface MyCropAlertData {
  cropName: string;
  price: string;
  mandi: string;
  trend: 'up' | 'down' | 'stable';
  trendIcon: React.ElementType;
}

export interface AiTipData {
  id: string;
  title: string;
  content: string;
}

export interface MandiRate {
  id:string;
  cropName: string;
  teluguCropName: string;
  hindiCropName?: string; // Optional Hindi crop name
  price: string;
  marketName: string;
  teluguMarketName: string;
  hindiMarketName?: string; // Optional Hindi market name
  trendData: { name: string; price: number }[]; // For small graph
  category: 'grains' | 'vegetables' | 'pulses' | 'other';
  isUserCrop?: boolean; // For "My Crops" filter
}

export enum CropSeason {
  Kharif = 'kharif',
  Rabi = 'rabi',
}

export interface CropGuideItem {
  id:string;
  name: string;
  teluguName: string;
  hindiName?: string; // Optional Hindi name
  image: string; // URL to image
  sowingPeriod: string;
  teluguSowingPeriod: string;
  hindiSowingPeriod?: string; // Optional Hindi sowing period
  duration: string;
  teluguDuration: string;
  hindiDuration?: string; // Optional Hindi duration
  aiRating: string; // e.g., "Highly suitable for your soil"
  teluguAiRating: string;
  hindiAiRating?: string; // Optional Hindi AI rating
  season: CropSeason;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sources?: GroundingChunk[]; // Optional: for AI messages with sources
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  retrievedContext?: {
    uri?: string;
    title?: string;
  };
}

// Lovable Civic Issues Section Types
export enum IssueCategory {
  Roads = 'roads',
  Drainage = 'drainage',
  WaterSupply = 'waterSupply',
  PowerOutage = 'powerOutage',
  Garbage = 'garbage',
  ElectricalInfrastructure = 'electricalInfrastructure',
  Other = 'other',
}

export enum IssueStatus {
  Open = 'open',
  InProgress = 'inProgress',
  Resolved = 'resolved',
  Rejected = 'rejected',
}

export interface CivicIssueComment {
  id: string;
  userName: string; // For simplicity, using name directly
  text: string;
  timestamp: Date;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: {
    text: string; // e.g., "Near Charminar, Hyderabad"
    // latitude?: number; // Optional, for future map integration
    // longitude?: number; // Optional
  };
  imageUrl?: string; // URL of the uploaded image (from mock or future storage)
  imageFile?: File; // Temporary for form handling, not stored in mock list directly
  submittedBy: string; // User name for simplicity
  submittedAt: Date;
  upvotes: number;
  comments: CivicIssueComment[];
}