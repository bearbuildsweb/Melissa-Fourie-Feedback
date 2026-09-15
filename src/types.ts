export type FeedbackStep = 'thoughts' | 'rate';

export interface FeedbackAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  isScreenshot?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface FeedbackSubmission {
  id: string;
  submittedAt: string;
  message: string;
  rating: number;
  aspectRatings?: {
    service: number;
    communication: number;
    punctuality: number;
  };
  recommend?: boolean;
  user: UserProfile;
}

export interface FormErrors {
  name?: string;
  message?: string;
  rating?: string;
  email?: string;
  general?: string;
}

