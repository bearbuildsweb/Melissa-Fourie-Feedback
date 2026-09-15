import React from 'react';
import { CheckCircle2, RotateCcw, Clock, Star, Heart, User } from 'lucide-react';
import { FeedbackSubmission } from '../types';

interface SubmissionSuccessProps {
  submission: FeedbackSubmission;
  onReset: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  submission,
  onReset,
}) => {
  return (
    <div
      id="feedback-success-container"
      className="py-6 px-2 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300"
    >
      {/* Animated Checkmark Circle */}
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-full bg-[#EFE7DE] flex items-center justify-center text-[#9E6F53] ring-8 ring-[#F5EEE6]">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
        </div>
      </div>

      <h2
        id="feedback-success-title"
        className="text-xl font-semibold text-[#2E2724] mb-1 tracking-tight"
      >
        Your words will stay with me.
      </h2>
      <p
        id="feedback-success-desc"
        className="text-xs sm:text-sm text-[#7C7067] max-w-sm mb-6 leading-relaxed"
      >
        Thanks for letting me be part of your story.
      </p>

      {/* Recap Card */}
      <div
        id="feedback-summary-card"
        className="w-full max-w-md bg-[#F8F3EC] border border-[#E5DDD2] rounded-xl p-4 text-left mb-6 space-y-3"
      >
        <div className="flex items-center justify-between text-xs text-[#7C7067] border-b border-[#E8DFC] border-b-[#E5DDD2] pb-2.5">
          {/* Star Rating Badge */}
          <div className="flex items-center gap-1 font-semibold text-[#B88746] bg-[#EDE5DC] px-2.5 py-0.5 rounded-full text-xs">
            <Star className="w-3.5 h-3.5 fill-[#DDA853] text-[#DDA853]" />
            <span>{submission.rating} / 5 Rating</span>
          </div>

          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#8C8075]">
            <Clock className="w-3 h-3" />
            {new Date(submission.submittedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Submitter Name */}
        {submission.user?.name && (
          <div className="flex items-center gap-1.5 text-xs text-[#4A3F39]">
            <User className="w-3.5 h-3.5 text-[#9E6F53]" />
            <span className="text-[#8C8075]">From:</span>
            <span className="font-semibold text-[#2E2724]">{submission.user.name}</span>
          </div>
        )}

        {/* Thoughts message */}
        <div>
          <span className="text-[11px] font-semibold text-[#8C8075] uppercase tracking-wider block mb-1">
            Thoughts & Feedback
          </span>
          <p className="text-xs text-[#3E3530] italic leading-relaxed">
            &ldquo;{submission.message}&rdquo;
          </p>
        </div>

        {/* Recommended note */}
        {submission.recommend !== undefined && (
          <div className="flex items-center gap-1.5 text-xs text-[#7C7067] pt-2 border-t border-[#E8DFC] border-t-[#E5DDD2]">
            <Heart className="w-3 h-3 text-[#B2604A] fill-[#B2604A]" />
            <span>
              Would recommend Melissa Fourie:{' '}
              <strong className="text-[#2E2724]">
                {submission.recommend ? 'Yes' : 'No'}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          id="send-another-btn"
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#2E2724] hover:bg-[#443A35] active:scale-95 text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs hover:shadow cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Submit Another Review</span>
        </button>
      </div>
    </div>
  );
};
