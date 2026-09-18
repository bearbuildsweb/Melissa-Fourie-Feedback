import { FeedbackSubmission } from '../types';

export const GOOGLE_SHEET_WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycbwUYQ6jBLoMkIg-u-tKV6qNdHaLZA8P_C0IX0e9ZvMgaeMnzmhGGQIpxxWBho0x-iHJ/exec';

export interface SheetSubmissionPayload {
  name: string;
  rating: number;
  message: string;
  aspectRatings?: {
    service: number;
    communication: number;
    punctuality: number;
  };
  recommend: boolean;
  submittedAt: string;
}

/**
 * Sends feedback submission to Google Apps Script Web App connected to Google Sheets.
 * Uses text/plain and no-cors mode to bypass browser preflight CORS limitations with Google Apps Script.
 */
export async function submitToGoogleSheet(submission: FeedbackSubmission): Promise<boolean> {
  const payload: SheetSubmissionPayload = {
    name: submission.user.name,
    rating: submission.rating,
    message: submission.message,
    aspectRatings: submission.aspectRatings,
    recommend: submission.recommend ?? true,
    submittedAt: submission.submittedAt,
  };

  try {
    const sendPromise = fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    // Guard with a 4-second timeout to keep the user experience responsive on all connections
    const timeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, 4000));

    await Promise.race([sendPromise, timeoutPromise]);
    return true;
  } catch (err) {
    console.error('Failed to submit feedback to Google Sheet:', err);
    return false;
  }
}
