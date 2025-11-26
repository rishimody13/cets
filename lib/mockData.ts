import { Assignment } from '@/types';

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    subject: 'Economics',
    question: 'Explain the concept of cosh-push inflation and how it arises.',
    createdAt: '2025-11-26',
    status: 'pending'
  },
  {
    id: '2',
    subject: 'Physics',
    question: 'Describe Newton\'s three laws of motion with real-world examples.',
    createdAt: '2025-11-26',
    status: 'pending'
  },
  {
    id: '3',
    subject: 'English Literature',
    question: 'Analyze the themes of identity and self-discovery across Shakespeare\'s plays.',
    createdAt: '2025-11-26',
    status: 'pending'
  }
//   ,{
//     id: '4',
//     subject: 'History',
//     question: 'Discuss the causes and consequences of World War II.',
//     createdAt: '2025-11-26',
//     status: 'pending'
//   }
];
