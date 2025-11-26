"use client";

import Link from 'next/link';
import { Assignment } from '@/types';

interface AssignmentCardProps {
  assignment: Assignment;
  userType: 'student' | 'teacher';
}

export default function AssignmentCard({ assignment, userType }: AssignmentCardProps) {
  const href = userType === 'student'
    ? `/student/assignment/${assignment.id}`
    : `/teacher/assignment/${assignment.id}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {assignment.subject}
          </h3>
          {assignment.status && (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              assignment.status === 'completed'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : assignment.status === 'in-progress'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {assignment.status}
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
          {assignment.question}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Created: {new Date(assignment.createdAt).toLocaleDateString()}
        </span>
        <Link href={href}>
          <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200">
            {userType === 'student' ? 'Start Assignment' : 'View Details'}
          </button>
        </Link>
      </div>
    </div>
  );
}
