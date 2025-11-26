# AI Assessment Platform

An AI-powered educational assessment platform that allows students to verbally explain concepts while AI analyzes their responses and provides detailed feedback across multiple assessment objectives.

## Features

### Student Features
- View assigned questions on a dashboard
- Record verbal explanations using voice input
- Real-time concept extraction displayed as draggable bubbles on a concept map
- Receive AI-generated feedback across four assessment objectives:
  - Knowledge and Understanding
  - Application and Analysis
  - Communication and Clarity
  - Critical Thinking
- View comprehensive feedback with progress bars and detailed comments

### Teacher Features
- View all assignments and student submissions
- Access AI-generated summary transcripts of student responses
- Review the same AI feedback that was provided to students
- Track student performance across multiple assessment objectives

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Claude API (Anthropic)
- **Speech Recognition**: Web Speech API
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An Anthropic API key

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your Anthropic API key to the `.env` file:
```
ANTHROPIC_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### For Students

1. From the landing page, click "Student"
2. Select an assignment from the dashboard
3. Click "Start Recording" to begin speaking your answer
4. Watch as concepts are extracted and displayed on the concept map
5. Drag and arrange concept bubbles as needed
6. Click "Finish and Submit" when done
7. Review your AI-generated feedback

### For Teachers

1. From the landing page, click "Teacher"
2. Select an assignment to view student submissions
3. Select a student from the list
4. Review the AI-generated summary transcript
5. See the detailed feedback provided to the student

## API Routes

- `POST /api/extract-keywords` - Extracts keywords from speech in real-time
- `POST /api/generate-feedback` - Generates comprehensive feedback for student submissions
- `GET /api/submissions/[id]` - Retrieves student submissions for a specific assignment

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   ├── student/                # Student pages
│   │   ├── dashboard/
│   │   ├── assignment/[id]/
│   │   └── feedback/[id]/
│   ├── teacher/                # Teacher pages
│   │   ├── dashboard/
│   │   └── assignment/[id]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Landing page
├── components/                 # Reusable components
│   ├── AssignmentCard.tsx
│   └── ConceptMap.tsx
├── lib/                       # Utilities and mock data
│   └── mockData.ts
└── types/                     # TypeScript type definitions
    └── index.ts
```

## Features in Detail

### Real-time Speech Analysis
The platform uses the Web Speech API to capture student responses in real-time and sends text chunks to Claude for keyword extraction.

### Concept Map
As students speak, important keywords and concepts are extracted by Claude and displayed as draggable bubbles, allowing students to organize their thoughts visually.

### AI-Powered Feedback
Claude analyzes the complete transcript and provides:
- Scores for four assessment objectives (0-100)
- Specific feedback for each objective
- Comprehensive overall feedback
- Constructive suggestions for improvement

### Teacher Dashboard
Teachers can review AI-generated summaries and feedback, giving them insight into student understanding without manually grading each response.

## Notes

- The speech recognition feature requires microphone permissions
- The platform works best in Chrome or Edge (Web Speech API support)
- Mock data is used for assignments - extend this for production use
- Consider implementing authentication for production deployment

## Future Enhancements

- User authentication and authorization
- Database integration for persistent storage
- Real-time collaboration features
- Export functionality for reports
- More assignment types and question formats
- Teacher ability to create custom assignments
- Analytics dashboard for tracking student progress over time
