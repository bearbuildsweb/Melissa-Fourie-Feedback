import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FeedbackCard } from './components/FeedbackCard';
import { SubmissionSuccess } from './components/SubmissionSuccess';
import { UserProfile, FeedbackSubmission } from './types';
import { submitToGoogleSheet } from './services/sheetService';
import profilePhoto from './ASSETS/profile.jpg';

const DEFAULT_USER: UserProfile = {
  name: '',
  email: '',
  avatarUrl: profilePhoto,
};

const STORAGE_KEY_HISTORY = 'feedback_history_items';
const STORAGE_KEY_USER = 'feedback_user_profile';

export default function App() {
  // User profile state
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  // Submission history
  const [history, setHistory] = useState<FeedbackSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<FeedbackSubmission | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist user profile
  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Submit feedback with smooth transition and Google Sheet recording
  const handleSubmitFeedback = async (submission: FeedbackSubmission) => {
    setIsSubmitting(true);

    try {
      // Send submission data to Google Sheet web app
      await submitToGoogleSheet(submission);
    } catch (err) {
      console.error('Submission recording error:', err);
    } finally {
      setIsSubmitting(false);
      setActiveSubmission(submission);

      const updatedHistory = [submission, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
      showToast('Thank you for your review');
    }
  };

  const handleResetForm = () => {
    setActiveSubmission(null);
  };

  return (
    <div
      id="app-root-wrapper"
      className="min-h-screen flex flex-col justify-between bg-[#F2ECE4] text-[#2E2724]"
    >
      {/* Top Utility Bar */}
      <header
        id="app-header"
        className="w-full max-w-4xl mx-auto px-4 py-5 flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9E6F53] shadow-xs" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#4A3F39]">
            MELISSA FOURIE MAKEUP
          </span>
        </div>

        {/* Circular Profile Picture (No green bubble) */}
        <div id="header-profile-avatar" className="flex items-center">
          <img
            src={profilePhoto}
            alt="Melissa Fourie"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#DDD2C5] shadow-xs"
          />
        </div>
      </header>

      {/* Main Content Area: Centered Modal Card */}
      <main
        id="main-feedback-container"
        className="flex-1 flex items-center justify-center p-4 sm:p-6"
      >
        <div
          id="modal-card-frame"
          className="w-full max-w-xl bg-[#FAF7F2] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E3DACF] p-6 sm:p-8 relative"
        >
          {activeSubmission ? (
            <SubmissionSuccess
              submission={activeSubmission}
              onReset={handleResetForm}
            />
          ) : (
            <FeedbackCard
              currentUser={currentUser}
              onUpdateUser={handleUpdateUser}
              onSubmit={handleSubmitFeedback}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </main>

      {/* Footer information */}
      <footer
        id="app-footer"
        className="w-full text-center py-4 text-[11px] text-[#7C7067] tracking-wider select-none"
      >
        <p>Melissa Fourie Makeup • Client Feedback & Review</p>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#2E2724] text-[#FAF7F2] px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-[#C49B7A]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
