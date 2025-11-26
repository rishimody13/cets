# AI Assessment Platform - Project Overview

## What Was Built

A complete full-stack web application for AI-powered educational assessments where students can verbally explain concepts and receive detailed AI-generated feedback.

## Key Features Implemented

### 1. Landing Page
- Clean, modern design with student/teacher role selection
- Responsive cards with hover effects
- Direct navigation to respective dashboards

### 2. Student Dashboard
- Displays assignment cards with subject and question
- Shows assignment status (pending/in-progress/completed)
- "Start Assignment" button for each card

### 3. Student Assignment Page
**Recording Functionality:**
- Three-state recording button:
  - "Start Recording" (green)
  - "Stop Recording" (red, with pulse animation)
  - "Continue Speaking" (yellow)
- Uses Web Speech API for real-time speech-to-text
- Visual feedback during recording

**Concept Map:**
- Real-time keyword extraction using Claude API
- Draggable concept bubbles
- Keywords appear automatically as student speaks
- Visual concept organization area

**Submit Functionality:**
- "Finish and Submit" button
- Processes transcript through Claude API
- Generates comprehensive feedback

### 4. Student Feedback Page
**Progress Bars:**
- Four assessment objectives with individual scores
- Color-coded progress bars (green/yellow/red based on score)
- Animated progress bar filling

**Detailed Feedback:**
- Brief feedback for each assessment objective
- Comprehensive overall feedback section
- Professional, encouraging tone

### 5. Teacher Dashboard
- Similar layout to student dashboard
- View all assignments
- "View Details" button for each assignment

### 6. Teacher Assignment View
**Student Selection:**
- Sidebar showing all student submissions
- Click to view individual student work

**Transcript Display:**
- AI-generated summary of student's verbal response
- Clean, readable format

**Feedback Display:**
- Same feedback shown to the student
- Progress bars for all assessment objectives
- Individual objective feedback
- Overall comprehensive feedback

### 7. Claude API Integration

**Three API Endpoints:**

1. **`/api/extract-keywords`**
   - Extracts 2-4 key concepts from speech segments
   - Called in real-time as student speaks
   - Returns keywords for concept bubble display

2. **`/api/generate-feedback`**
   - Analyzes complete transcript
   - Generates scores for 4 assessment objectives
   - Creates detailed feedback for each objective
   - Writes comprehensive overall feedback
   - Returns structured JSON response

3. **`/api/submissions/[id]`**
   - Fetches submissions for specific assignment
   - Generates AI summary transcripts
   - Creates teacher-facing feedback views
   - Handles mock data for demo purposes

## Assessment Objectives

The platform evaluates students across four dimensions:

1. **Knowledge and Understanding** - Factual accuracy and comprehension
2. **Application and Analysis** - Practical application of concepts
3. **Communication and Clarity** - Verbal communication skills
4. **Critical Thinking** - Analytical and evaluative thinking

## Technical Stack

- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Claude 3.5 Sonnet (Anthropic)
- **Speech**: Web Speech API
- **State Management**: React hooks
- **Animation**: CSS transitions + Framer Motion

## File Structure

```
/Users/rmody/CETS_2025/
├── app/
│   ├── api/
│   │   ├── extract-keywords/route.ts    # Real-time keyword extraction
│   │   ├── generate-feedback/route.ts   # Comprehensive feedback generation
│   │   └── submissions/[id]/route.ts    # Teacher submission views
│   ├── student/
│   │   ├── dashboard/page.tsx           # Student assignment list
│   │   ├── assignment/[id]/page.tsx     # Recording interface
│   │   └── feedback/[id]/page.tsx       # Feedback display
│   ├── teacher/
│   │   ├── dashboard/page.tsx           # Teacher assignment list
│   │   └── assignment/[id]/page.tsx     # Submission reviews
│   ├── globals.css                      # Global styles
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Landing page
├── components/
│   ├── AssignmentCard.tsx              # Reusable assignment card
│   └── ConceptMap.tsx                  # Draggable concept bubbles
├── lib/
│   └── mockData.ts                     # Mock assignment data
├── types/
│   └── index.ts                        # TypeScript interfaces
├── .env.example                         # Environment template
├── README.md                            # Main documentation
├── SETUP.md                            # Setup instructions
└── package.json                        # Dependencies
```

## How It Works

### Student Flow:
1. Student selects assignment from dashboard
2. Clicks "Start Recording" and speaks their answer
3. As they speak:
   - Speech is converted to text
   - Text is sent to Claude API
   - Keywords are extracted
   - Concept bubbles appear on map
4. Student can drag bubbles to organize concepts
5. Clicks "Finish and Submit"
6. Complete transcript sent to Claude for analysis
7. Receives detailed feedback with scores

### Teacher Flow:
1. Teacher selects assignment from dashboard
2. Views list of student submissions
3. Clicks on a student
4. Sees:
   - AI-generated summary transcript
   - Assessment scores and progress bars
   - Detailed feedback for each objective
   - Overall comprehensive feedback

### AI Processing:
1. **Real-time**: Small text chunks → keyword extraction
2. **On Submit**: Full transcript → comprehensive analysis
3. **Teacher View**: Raw transcript → summary + feedback

## What Makes This Unique

- **Voice-first interface**: Students explain concepts naturally
- **Real-time visualization**: Concepts appear as bubbles while speaking
- **Comprehensive AI feedback**: Four-dimensional assessment
- **Dual perspective**: Both student and teacher views
- **No manual grading**: AI handles all assessment
- **Constructive feedback**: Encouraging and specific guidance

## Future Enhancement Ideas

- Multi-language support
- Voice analysis (pace, clarity, confidence)
- Comparison with exemplar answers
- Peer review features
- Progress tracking over time
- Custom rubrics per assignment
- Export reports as PDF
- Integration with LMS platforms
- Mobile app version
- Offline recording capability
