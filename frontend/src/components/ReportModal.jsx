'use client';

import { useState } from 'react';
import { submitReport } from '@/lib/reports';

export default function ReportModal({ targetType, targetId, targetName, onClose }) {
  const [reason, setReason] = useState('Spam');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await submitReport({
        targetType,
        targetId,
        targetName,
        reason,
        description,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in border border-[#EEEDFB]">
        <div className="p-6 border-b border-[#EEEDFB]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1E1B2E]">Report {targetType}</h3>
            <button
              onClick={onClose}
              className="text-[#B3AFC9] hover:text-[#1E1B2E] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <p className="text-xs text-[#B3AFC9] mt-1 truncate">
            Reporting: <span className="font-semibold text-[#6C5CE7]">{targetName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl border border-green-100 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Report submitted successfully!
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#B3AFC9] uppercase tracking-wider mb-2">
              Reason for Report
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading || success}
              className="w-full bg-[#F4F3FE] border border-transparent focus:border-[#6C5CE7] focus:bg-white text-sm text-[#1E1B2E] rounded-xl px-4 py-3 outline-none transition-all"
            >
              <option value="Spam">Spam</option>
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Scam/Fraud">Scam / Fraud</option>
              <option value="Broken Link/Info">Broken Link / Info</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B3AFC9] uppercase tracking-wider mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading || success}
              placeholder="Provide any additional context..."
              rows="4"
              className="w-full bg-[#F4F3FE] border border-transparent focus:border-[#6C5CE7] focus:bg-white text-sm text-[#1E1B2E] rounded-xl px-4 py-3 outline-none resize-none transition-all"
            ></textarea>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-[#6C5CE7] bg-[#F4F3FE] hover:bg-[#EEEDFB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white bg-[#6C5CE7] hover:bg-[#5A4AD1] disabled:bg-[#B3AFC9] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10"></circle>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
