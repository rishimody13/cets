// Simple in-memory store for student submissions
// In production, this would be replaced with a database

import { StudentSubmission } from '@/types';

class SubmissionStore {
  private submissions: Map<string, StudentSubmission[]> = new Map();

  addSubmission(submission: StudentSubmission) {
    const assignmentId = submission.assignmentId;
    const existing = this.submissions.get(assignmentId) || [];

    // Check if submission already exists for this student and assignment
    const index = existing.findIndex(
      s => s.studentId === submission.studentId && s.assignmentId === submission.assignmentId
    );

    if (index >= 0) {
      // Update existing submission
      existing[index] = submission;
    } else {
      // Add new submission
      existing.push(submission);
    }

    this.submissions.set(assignmentId, existing);
  }

  getSubmissionsByAssignment(assignmentId: string): StudentSubmission[] {
    return this.submissions.get(assignmentId) || [];
  }

  getSubmission(assignmentId: string, studentId: string): StudentSubmission | undefined {
    const submissions = this.submissions.get(assignmentId) || [];
    return submissions.find(s => s.studentId === studentId);
  }

  getAllSubmissions(): StudentSubmission[] {
    const all: StudentSubmission[] = [];
    this.submissions.forEach(submissions => {
      all.push(...submissions);
    });
    return all;
  }

  clearAll() {
    this.submissions.clear();
  }
}

// Export a singleton instance
export const submissionStore = new SubmissionStore();
