"use client";

import { useParams } from 'next/navigation';
import { mockAssignments } from '@/lib/mockData';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AOFulfilmentCheck {
  status: 'Yes' | 'Partially' | 'No';
  evidence: string[];
}

interface Insight {
  text: string;
  classification: 'Novel' | 'Standard' | 'Incorrect';
  rarity: number;
  relevance: 'Relevant' | 'Marginal' | 'Off-topic';
}

interface StudentSubmissionView {
  studentName: string;
  transcript: string;
  assessmentObjectives: Array<{
    id: string;
    name: string;
    score: number;
    feedback: string;
  }>;
  overallFeedback: string;
  aoFulfilmentCheck?: Record<string, AOFulfilmentCheck>;
  insights?: Insight[];
  submittedAt: string;
}

export default function TeacherAssignmentView() {
  const params = useParams();
  const assignmentId = params.id as string;
  const assignment = mockAssignments.find(a => a.id === assignmentId);
  const [submissions, setSubmissions] = useState<StudentSubmissionView[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmissionView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`/api/submissions/${assignmentId}`);
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data.submissions || []);
          if (data.submissions && data.submissions.length > 0) {
            setSelectedSubmission(data.submissions[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Assignment not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {assignment.subject}: Student Submissions
            </h1>
            <p className="text-lg text-green-600 dark:text-green-400 font-medium mt-1">
              {assignment.subTopic}
            </p>
          </div>
          <Link href="/teacher/dashboard">
            <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200">
              Back to Dashboard
            </button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Assignment Question
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{assignment.question}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-xl">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No submissions yet for this assignment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Students ({submissions.length})
              </h3>
              {submissions.map((submission, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSubmission(submission)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                    selectedSubmission === submission
                      ? 'bg-green-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {submission.studentName}
                </button>
              ))}
            </div>

            {selectedSubmission && (
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {selectedSubmission.studentName}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                      Summary Transcript
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {selectedSubmission.transcript}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                      AI Feedback to Student
                    </h4>

                    <div className="space-y-6">
                      {selectedSubmission.assessmentObjectives.map((ao) => (
                        <div key={ao.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-gray-800 dark:text-white">
                              {ao.name}
                            </h5>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                              {ao.score}%
                            </span>
                          </div>

                          <div className="relative w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`absolute top-0 left-0 h-full rounded-full ${
                                ao.score >= 80
                                  ? 'bg-green-500'
                                  : ao.score >= 60
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${ao.score}%` }}
                            ></div>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded">
                            {ao.feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedSubmission.aoFulfilmentCheck && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                        Assessment Objectives Fulfilment
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(selectedSubmission.aoFulfilmentCheck).map(([aoId, check]) => (
                          <div key={aoId} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gray-800 dark:text-white uppercase">
                                {aoId}
                              </h5>
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

                  {selectedSubmission.insights && selectedSubmission.insights.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                        Student Insights
                      </h4>
                      <div className="space-y-3">
                        {selectedSubmission.insights.map((insight, idx) => (
                          <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
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

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                      Overall Feedback
                    </h4>
                    <div className="bg-green-50 dark:bg-gray-900 p-4 rounded-lg border-l-4 border-green-500">
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                        {selectedSubmission.overallFeedback}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
