import React, { useState, useRef } from 'react';
import {
  AlertCircle,
  Loader2,
  User,
  Star,
  ChevronRight,
  ChevronLeft,
  Heart,
  Sparkles,
} from 'lucide-react';
import {
  FeedbackStep,
  UserProfile,
  FeedbackSubmission,
  FormErrors,
} from '../types';

interface FeedbackCardProps {
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onSubmit: (submission: FeedbackSubmission) => void;
  isSubmitting: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  currentUser,
  onUpdateUser,
  onSubmit,
  isSubmitting,
}) => {
  const [activeStep, setActiveStep] = useState<FeedbackStep>('thoughts');
  const [personName, setPersonName] = useState(
    currentUser.name === 'Karen Ryes' ? '' : currentUser.name
  );
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [recommend, setRecommend] = useState<boolean>(true);
  const [aspectRatings, setAspectRatings] = useState({
    service: 5,
    communication: 5,
    punctuality: 5,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  // Timestamp ref to prevent double-click or enter-key event bleed-through from Step 1 to Step 2
  const stepEnteredAtRef = useRef<number>(0);

  // Validation for Step 1 (Thoughts & Name)
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!personName.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!message.trim()) {
      newErrors.message = 'Please leave a few thoughts before continuing.';
    } else if (message.trim().length < 5) {
      newErrors.message = 'Please enter at least 5 characters.';
    }

    setErrors(newErrors);

    if (newErrors.name) {
      nameInputRef.current?.focus();
    } else if (newErrors.message) {
      textareaRef.current?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  // Validation for Step 2 (Rating & final submit)
  const validateFinal = (): boolean => {
    const newErrors: FormErrors = {};

    if (!personName.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!message.trim()) {
      newErrors.message = 'Please leave a few thoughts before submitting.';
    }

    if (!rating || rating < 1) {
      newErrors.rating = 'Please provide an overall rating.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextToRate = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (validateStep1()) {
      onUpdateUser({
        ...currentUser,
        name: personName.trim(),
      });
      stepEnteredAtRef.current = Date.now();
      setActiveStep('rate');
    }
  };

  const handleBackToThoughts = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveStep('thoughts');
  };

  const handleFinalSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // STRICT GUARD 1: Only allow submission if on the 'rate' step
    if (activeStep !== 'rate') {
      handleNextToRate(e);
      return;
    }

    // STRICT GUARD 2: Prevent instant submission if the user just transitioned to step 2
    // within 450ms (guards against double clicks, keydown/keyup bleed, touch hold)
    if (Date.now() - stepEnteredAtRef.current < 450) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    if (!validateFinal()) {
      return;
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      name: personName.trim(),
    };

    onUpdateUser(updatedUser);

    const submission: FeedbackSubmission = {
      id: 'fb-' + Date.now(),
      submittedAt: new Date().toISOString(),
      message: message.trim(),
      rating,
      aspectRatings,
      recommend,
      user: updatedUser,
    };

    onSubmit(submission);
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return 'Exceptional experience!';
      case 4:
        return 'Really great service';
      case 3:
        return 'Good / Met expectations';
      case 2:
        return 'Could have been better';
      case 1:
        return 'Disappointing experience';
      default:
        return 'Select a rating';
    }
  };

  return (
    <div id="feedback-card" className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E8DFC] border-b-[#E5DDD2]">
        <div className="flex items-center gap-2.5">
          <h1
            id="feedback-form-title"
            className="text-lg md:text-xl font-semibold text-[#2E2724] tracking-tight"
          >
            Client Feedback
          </h1>
          {/* Step Pill */}
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#EFE7DE] text-[#63554B]">
            Step {activeStep === 'thoughts' ? '1' : '2'} of 2
          </span>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (activeStep === 'thoughts') {
            handleNextToRate(e);
          } else {
            handleFinalSubmit(e);
          }
        }}
        className="pt-4 space-y-4"
      >
        {/* Name Input Field for the person giving feedback */}
        <div id="client-name-container" className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="client-name-input"
              className="text-xs font-semibold text-[#4A3F39] uppercase tracking-wider flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#9E6F53]" />
              <span>Your Name</span>
              <span className="text-[#9E6F53] font-bold">*</span>
            </label>
            <span className="text-[11px] text-[#8C8075]">
              Person giving feedback
            </span>
          </div>

          <div className="relative">
            <input
              ref={nameInputRef}
              id="client-name-input"
              type="text"
              value={personName}
              onChange={(e) => {
                setPersonName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  textareaRef.current?.focus();
                }
              }}
              placeholder="e.g. Sarah Jenkins"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-[#2E2724] placeholder-[#A0958C] transition-all focus:outline-none shadow-2xs ${
                errors.name
                  ? 'border-rose-400 ring-1 ring-rose-400/30'
                  : 'border-[#DDD2C5] focus:border-[#9E6F53] focus:ring-1 focus:ring-[#9E6F53]/25'
              }`}
            />
          </div>

          {errors.name && (
            <p
              id="name-validation-error"
              className="text-xs text-rose-600 flex items-center gap-1 animate-in fade-in"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* The Enclosed Feedback Input Box */}
        <div
          id="feedback-input-box"
          className={`border rounded-xl transition-all duration-200 bg-white overflow-hidden shadow-2xs ${
            errors.message || errors.rating
              ? 'border-rose-400 ring-1 ring-rose-400/30'
              : 'border-[#DDD2C5] focus-within:border-[#9E6F53]'
          }`}
        >
          {/* Top 2 Navigation Tabs:
              Tab 1: "Leave a few thoughts"
              Tab 2: "Rate" */}
          <div
            id="feedback-category-tabs"
            className="flex items-center border-b border-[#E5DDD2] bg-[#F7F2EB]"
          >
            {/* Tab 1: Leave a few thoughts */}
            <button
              id="tab-thoughts"
              type="button"
              onClick={handleBackToThoughts}
              className={`relative flex-1 sm:flex-none px-5 py-3 text-xs font-medium whitespace-nowrap transition-colors select-none text-left cursor-pointer ${
                activeStep === 'thoughts'
                  ? 'text-[#2E2724] font-semibold'
                  : 'text-[#7C7067] hover:text-[#4A3F39]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#E5DDD2] text-[10px] flex items-center justify-center font-bold text-[#4A3F39]">
                  1
                </span>
                <span>Leave a few thoughts</span>
              </div>
              {/* Active warm accent line */}
              {activeStep === 'thoughts' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#9E6F53]" />
              )}
            </button>

            {/* Tab 2: Rate */}
            <button
              id="tab-rate"
              type="button"
              onClick={() => {
                if (validateStep1()) {
                  stepEnteredAtRef.current = Date.now();
                  setActiveStep('rate');
                }
              }}
              className={`relative flex-1 sm:flex-none px-5 py-3 text-xs font-medium whitespace-nowrap transition-colors select-none text-left cursor-pointer ${
                activeStep === 'rate'
                  ? 'text-[#2E2724] font-semibold'
                  : 'text-[#7C7067] hover:text-[#4A3F39]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#E5DDD2] text-[10px] flex items-center justify-center font-bold text-[#4A3F39]">
                  2
                </span>
                <span>Rate</span>
              </div>
              {/* Active warm accent line */}
              {activeStep === 'rate' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#9E6F53]" />
              )}
            </button>
          </div>

          {/* Tab 1 Content: Text Area for "Leave a few thoughts" */}
          {activeStep === 'thoughts' && (
            <div id="step-thoughts-content" className="p-4 space-y-2 animate-in fade-in duration-200">
              <textarea
                ref={textareaRef}
                id="feedback-message-textarea"
                rows={6}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) {
                    setErrors((prev) => ({ ...prev, message: undefined }));
                  }
                }}
                placeholder="Please describe your experience with Melissa Fourie Makeup, looks you loved, or any thoughts for future appointments..."
                className="w-full bg-transparent resize-y text-[#2E2724] placeholder-[#A0958C] text-sm focus:outline-none leading-relaxed min-h-[140px]"
                aria-label="Feedback message"
              />

              {/* Character counter & guidance */}
              <div className="flex items-center justify-between pt-2 border-t border-[#EFE7DE] text-[11px] text-[#8C8075] select-none">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#B88746]" />
                  Your review helps refine every makeup artistry appointment
                </span>
                <span>{message.length} / 1000</span>
              </div>
            </div>
          )}

          {/* Tab 2 Content: Interactive "Rate" Experience */}
          {activeStep === 'rate' && (
            <div id="step-rate-content" className="p-5 space-y-5 animate-in fade-in duration-200">
              {/* Overall Star Rating */}
              <div className="text-center space-y-2">
                <p className="text-xs uppercase tracking-wider text-[#7C7067] font-semibold">
                  Overall Rating
                </p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = (hoverRating !== null ? hoverRating : rating) >= starVal;
                    return (
                      <button
                        key={starVal}
                        id={`star-btn-${starVal}`}
                        type="button"
                        onClick={() => {
                          setRating(starVal);
                          if (errors.rating) {
                            setErrors((prev) => ({ ...prev, rating: undefined }));
                          }
                        }}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1.5 transition-transform hover:scale-115 focus:outline-none cursor-pointer"
                        aria-label={`Rate ${starVal} star${starVal > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            isFilled
                              ? 'fill-[#DDA853] text-[#DDA853] drop-shadow-xs'
                              : 'text-[#DDD2C5] stroke-[1.5]'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-medium text-[#9E6F53]">
                  {getRatingLabel(hoverRating !== null ? hoverRating : rating)}
                </p>
              </div>

              {/* Aspect Ratings Breakdown */}
              <div className="border-t border-[#EFE7DE] pt-4 space-y-2.5">
                <p className="text-[11px] font-semibold text-[#6E6258] uppercase tracking-wider">
                  Service Specifics
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Service quality */}
                  <div className="p-2.5 rounded-lg bg-[#F9F5F0] border border-[#E5DDD2] text-left">
                    <span className="text-xs text-[#4A3F39] font-medium block mb-1.5">
                      Makeup Artistry
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAspectRatings((prev) => ({ ...prev, service: val }))}
                          className="p-0.5 cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              aspectRatings.service >= val
                                ? 'fill-[#DDA853] text-[#DDA853]'
                                : 'text-[#DDD2C5]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Communication */}
                  <div className="p-2.5 rounded-lg bg-[#F9F5F0] border border-[#E5DDD2] text-left">
                    <span className="text-xs text-[#4A3F39] font-medium block mb-1.5">
                      Communication
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() =>
                            setAspectRatings((prev) => ({ ...prev, communication: val }))
                          }
                          className="p-0.5 cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              aspectRatings.communication >= val
                                ? 'fill-[#DDA853] text-[#DDA853]'
                                : 'text-[#DDD2C5]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Punctuality */}
                  <div className="p-2.5 rounded-lg bg-[#F9F5F0] border border-[#E5DDD2] text-left">
                    <span className="text-xs text-[#4A3F39] font-medium block mb-1.5">
                      Punctuality
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() =>
                            setAspectRatings((prev) => ({ ...prev, punctuality: val }))
                          }
                          className="p-0.5 cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              aspectRatings.punctuality >= val
                                ? 'fill-[#DDA853] text-[#DDA853]'
                                : 'text-[#DDD2C5]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation toggle */}
              <div className="border-t border-[#EFE7DE] pt-3.5 flex items-center justify-between">
                <span className="text-xs text-[#52463F] flex items-center gap-1.5 font-medium">
                  <Heart className="w-3.5 h-3.5 text-[#B2604A] fill-[#B2604A]" />
                  Would you recommend Melissa Fourie to others?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRecommend(true)}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      recommend
                        ? 'bg-[#2E2724] text-white'
                        : 'bg-[#EFE7DE] text-[#6E6258] hover:bg-[#E5DDD2]'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommend(false)}
                    className={`px-3.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      !recommend
                        ? 'bg-[#2E2724] text-white'
                        : 'bg-[#EFE7DE] text-[#6E6258] hover:bg-[#E5DDD2]'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Validation Errors */}
        {errors.message && (
          <p
            id="message-validation-error"
            className="text-xs text-rose-600 flex items-center gap-1 px-1 font-medium animate-in fade-in"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors.message}</span>
          </p>
        )}

        {errors.rating && (
          <p
            id="rating-validation-error"
            className="text-xs text-rose-600 flex items-center gap-1 px-1 font-medium animate-in fade-in"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors.rating}</span>
          </p>
        )}

        {/* 2-Step Footer Controls */}
        <div id="feedback-form-footer" className="pt-2 flex items-center justify-between">
          <div>
            {activeStep === 'thoughts' ? (
              /* Step 1 CTA: Continue to Rating */
              <button
                key="step-thoughts-continue-btn"
                id="next-to-rate-btn"
                type="button"
                onClick={handleNextToRate}
                className="px-7 py-2.5 rounded-full bg-[#2E2724] hover:bg-[#443A35] active:scale-95 text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xs hover:shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>CONTINUE TO RATE</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            ) : (
              /* Step 2 CTA: Final Send Feedback */
              <button
                key="step-rate-submit-btn"
                id="send-feedback-btn"
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-7 py-2.5 rounded-full bg-[#2E2724] hover:bg-[#443A35] active:scale-95 disabled:opacity-60 disabled:pointer-events-none text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xs hover:shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>SENDING...</span>
                  </>
                ) : (
                  <span>SEND FEEDBACK</span>
                )}
              </button>
            )}
          </div>

          {/* If on Step 2, provide quick link back to step 1 */}
          {activeStep === 'rate' && (
            <button
              id="back-to-thoughts-btn"
              type="button"
              onClick={handleBackToThoughts}
              className="text-xs text-[#7C7067] hover:text-[#2E2724] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Edit thoughts</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
