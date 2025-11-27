export interface Assignment {
  id: string;
  subject: string;
  subTopic: string;
  question: string;
  createdAt: string;
  visibleToStudents: boolean;
  studentId?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface ConceptBubble {
  id: string;
  text: string;
  x: number;
  y: number;
}

export interface AssessmentObjective {
  id: string;
  name: string;
  score: number;
  feedback: string;
}

export interface AOFulfilmentCheck {
  status: 'Yes' | 'Partially' | 'No';
  evidence: string[];
}

export interface Insight {
  text: string;
  classification: 'Novel' | 'Standard' | 'Incorrect';
  rarity: number;
  relevance: 'Relevant' | 'Marginal' | 'Off-topic';
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  transcript: string;
  conceptMap: ConceptBubble[];
  assessmentObjectives: AssessmentObjective[];
  overallFeedback: string;
  aoFulfilmentCheck?: Record<string, AOFulfilmentCheck>;
  insights?: Insight[];
  submittedAt: string;
}
