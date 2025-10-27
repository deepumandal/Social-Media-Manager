"use client";

import React, { useState } from "react";
import { LinkedInPostPreview } from "@/components/preview/LinkedInPostPreview";
import { markdownToUnicodeText } from "@/utils/contentConverter";

interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onPostNow: () => void;
  onSchedule: (scheduledAt: Date) => void;
  saving: boolean;
  postId: string | null;
  platform: string | null;
}

export const PostPreviewModal = ({
  isOpen,
  onClose,
  content,
  onPostNow,
  onSchedule,
  saving,
}: PostPreviewModalProps) => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const handleScheduleSubmit = () => {
    if (!scheduleDate || !scheduleTime) {
      alert("Please select both date and time");
      return;
    }

    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`);
    if (isNaN(scheduledAt.getTime())) {
      alert("Invalid date/time");
      return;
    }

    if (scheduledAt <= new Date()) {
      alert("Please select a future date and time");
      return;
    }

    onSchedule(scheduledAt);
    setShowScheduleForm(false);
    setScheduleDate("");
    setScheduleTime("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold my-0! text-gray-900">
            Post Preview & Actions
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div>
            {/* Left Side - Preview */}

            <LinkedInPostPreview content={content} />

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onPostNow}
                disabled={saving}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{saving ? "Posting..." : "Post Now"}</span>
              </button>

              {!showScheduleForm ? (
                <button
                  onClick={() => setShowScheduleForm(true)}
                  disabled={saving}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Schedule Post</span>
                </button>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-gray-900">Schedule Post</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleScheduleSubmit}
                      disabled={saving}
                      className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Schedule
                    </button>
                    <button
                      onClick={() => {
                        setShowScheduleForm(false);
                        setScheduleDate("");
                        setScheduleTime("");
                      }}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  const unicodeContent = markdownToUnicodeText(content);
                  navigator.clipboard.writeText(unicodeContent);
                  alert("Unicode content copied to clipboard!");
                }}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                <span>Copy Unicode Text</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
