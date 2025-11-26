"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AssessmentObjective, AOFulfilmentCheck, Insight } from '@/types';
import Link from 'next/link';

interface FeedbackData {
  assessmentObjectives: AssessmentObjective[];
  overallFeedback: string;
  aoFulfilmentCheck?: Record<string, AOFulfilmentCheck>;
  insights?: Insight[];
}

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        setFeedbackData(parsed);
      } catch (error) {
        console.error('Error parsing feedback data:', error);
      }
    }
  }, [searchParams]);

  if (!feedbackData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Assessment Feedback
          </h1>

          <div className="space-y-8 mb-8">
            {feedbackData.assessmentObjectives.map((ao) => (
              <div key={ao.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {ao.name}
                  </h2>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {ao.score}%
                  </span>
                </div>

                <div className="relative w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                      ao.score >= 80
                        ? 'bg-green-500'
                        : ao.score >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${ao.score}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  {ao.feedback}
                </p>
              </div>
            ))}
          </div>

          {feedbackData.aoFulfilmentCheck && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Assessment Objectives Fulfilment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(feedbackData.aoFulfilmentCheck).map(([aoId, check]) => (
                  <div key={aoId} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white uppercase">
                        {aoId}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          check.status === 'Yes'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : check.status === 'Partially'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {check.status}
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {check.evidence.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {feedbackData.insights && feedbackData.insights.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Key Insights from Your Response
              </h2>
              <div className="space-y-3">
                {feedbackData.insights.map((insight, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-gray-800 dark:text-gray-200 flex-1">
                        {insight.text}
                      </p>
                      <div className="flex items-center gap-2 ml-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            insight.classification === 'Novel'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              : insight.classification === 'Standard'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {insight.classification}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <span>Rarity: {'⭐'.repeat(insight.rarity)}</span>
                      <span className={`font-semibold ${
                        insight.relevance === 'Relevant'
                          ? 'text-green-600 dark:text-green-400'
                          : insight.relevance === 'Marginal'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {insight.relevance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Comprehensive Feedback
            </h2>
            <div className="bg-blue-50 dark:bg-gray-900 p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                {feedbackData.overallFeedback}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Link href="/student/dashboard">
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
