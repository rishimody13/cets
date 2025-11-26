# Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Landing Page                              │
│                    (Role Selection)                              │
└──────────────┬──────────────────────────────┬───────────────────┘
               │                               │
               ▼                               ▼
    ┌──────────────────┐            ┌──────────────────┐
    │     Student      │            │     Teacher      │
    │    Dashboard     │            │    Dashboard     │
    └────────┬─────────┘            └────────┬─────────┘
             │                               │
             ▼                               ▼
    ┌──────────────────┐            ┌──────────────────┐
    │   Assignment     │            │   Assignment     │
    │   Page           │            │   Review Page    │
    │   (Recording)    │            │                  │
    └────────┬─────────┘            └────────┬─────────┘
             │                               │
             ▼                               │
    ┌──────────────────┐                    │
    │   Feedback       │                    │
    │   Page           │                    │
    └──────────────────┘                    │
                                            │
                 ┌──────────────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  API Layer      │
        │  (Claude AI)    │
        └─────────────────┘
```

## Component Hierarchy

```
App (Layout)
├── Landing Page
│   ├── Student Card (Link to /student/dashboard)
│   └── Teacher Card (Link to /teacher/dashboard)
│
├── Student Routes
│   ├── Dashboard
│   │   └── AssignmentCard[] (Links to /student/assignment/[id])
│   │
│   ├── Assignment/[id]
│   │   ├── Recording Controls
│   │   │   └── Recording Button (3 states)
│   │   ├── ConceptMap
│   │   │   └── ConceptBubble[] (draggable)
│   │   └── Submit Button
│   │
│   └── Feedback/[id]
│       ├── Assessment Objective[]
│       │   ├── Progress Bar
│       │   └── Feedback Text
│       └── Overall Feedback
│
└── Teacher Routes
    ├── Dashboard
    │   └── AssignmentCard[] (Links to /teacher/assignment/[id])
    │
    └── Assignment/[id]
        ├── Student List (Sidebar)
        └── Submission View
            ├── Summary Transcript
            ├── Assessment Objectives[]
            │   ├── Progress Bar
            │   └── Feedback Text
            └── Overall Feedback
```

## Data Flow

### Student Assignment Submission Flow

```
┌──────────────┐
│   Student    │
│   Speaks     │
└──────┬───────┘
       │ (voice)
       ▼
┌──────────────────┐
│  Web Speech API  │
│  (Browser)       │
└──────┬───────────┘
       │ (text chunks)
       ▼
┌──────────────────────┐
│  POST /api/extract-  │
│  keywords            │
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│  Claude API      │
│  (Keyword        │
│   Extraction)    │
└──────┬───────────┘
       │ (keywords[])
       ▼
┌──────────────────┐
│  Concept Map     │
│  Component       │
│  (adds bubbles)  │
└──────────────────┘

[When student clicks "Finish and Submit"]

┌──────────────────┐
│  Full Transcript │
│  + Concepts      │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│  POST /api/generate- │
│  feedback            │
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│  Claude API      │
│  (Comprehensive  │
│   Analysis)      │
└──────┬───────────┘
       │ (feedback data)
       ▼
┌──────────────────┐
│  Feedback Page   │
│  (with scores)   │
└──────────────────┘
```

### Teacher Submission View Flow

```
┌──────────────────┐
│  Teacher clicks  │
│  Assignment      │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│  GET /api/           │
│  submissions/[id]    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────┐
│  Fetch stored    │
│  submissions     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  For each        │
│  submission:     │
│  Generate        │
│  summary via     │
│  Claude API      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Display all     │
│  submissions     │
│  with feedback   │
└──────────────────┘
```

## API Endpoints

### 1. `/api/extract-keywords`
**Method:** POST

**Request:**
```json
{
  "text": "Photosynthesis is the process where plants..."
}
```

**Response:**
```json
{
  "keywords": ["photosynthesis", "chloroplast", "glucose"]
}
```

**Purpose:** Real-time keyword extraction during recording

---

### 2. `/api/generate-feedback`
**Method:** POST

**Request:**
```json
{
  "assignmentId": "1",
  "transcript": "Full student response text...",
  "concepts": ["keyword1", "keyword2"]
}
```

**Response:**
```json
{
  "assessmentObjectives": [
    {
      "id": "ao1",
      "name": "Knowledge and Understanding",
      "score": 85,
      "feedback": "Excellent grasp of core concepts..."
    },
    // ... 3 more objectives
  ],
  "overallFeedback": "Overall strong response..."
}
```

**Purpose:** Generate comprehensive feedback after submission

---

### 3. `/api/submissions/[id]`
**Method:** GET

**Response:**
```json
{
  "submissions": [
    {
      "studentName": "John Doe",
      "transcript": "Summary of student response...",
      "submittedAt": "2024-01-15T10:30:00Z",
      "assessmentObjectives": [...],
      "overallFeedback": "..."
    }
  ]
}
```

**Purpose:** Fetch student submissions for teacher review

## State Management

### Student Assignment Page State

```typescript
// Recording state
recordingState: 'idle' | 'recording' | 'paused'

// Transcript accumulation
transcript: string

// Concept bubbles
concepts: ConceptBubble[] = [{
  id: string,
  text: string,
  x: number,
  y: number
}]

// Processing status
isProcessing: boolean
```

### Concept Map Component State

```typescript
// Currently dragged bubble
draggedBubble: string | null

// Drag offset for smooth movement
dragOffset: { x: number, y: number }

// Concepts array (passed from parent)
concepts: ConceptBubble[]
```

## Technology Decisions

### Why Next.js 15?
- App Router for modern React patterns
- Built-in API routes
- Excellent TypeScript support
- Server and client components
- Simple deployment

### Why Claude API?
- Advanced language understanding
- Consistent JSON output
- Good educational context handling
- Real-time keyword extraction
- Comprehensive feedback generation

### Why Web Speech API?
- Native browser support
- No additional dependencies
- Real-time transcription
- Free to use
- Good accuracy

### Why Tailwind CSS?
- Rapid UI development
- Consistent design system
- Responsive utilities
- Dark mode support
- Small bundle size

## Security Considerations

### Current Implementation
- API key stored in environment variables
- No authentication implemented
- No rate limiting
- No input sanitization

### Production Recommendations
1. Implement authentication (NextAuth.js)
2. Add rate limiting on API routes
3. Sanitize user inputs
4. Implement CORS properly
5. Add request validation
6. Use secure session management
7. Implement role-based access control
8. Add audit logging
9. Encrypt sensitive data
10. Use HTTPS only

## Performance Considerations

### Optimizations Implemented
- Component code splitting (Next.js automatic)
- CSS purging (Tailwind)
- Image optimization (Next.js)
- API response caching potential

### Future Optimizations
1. Implement request debouncing for keyword extraction
2. Cache API responses
3. Lazy load components
4. Optimize bundle size
5. Implement Progressive Web App features
6. Add loading skeletons
7. Optimize database queries (when added)
8. Implement CDN for static assets

## Scalability Considerations

### Current Limitations
- No database (mock data only)
- Single server instance
- No load balancing
- No caching layer
- Limited concurrent users

### Scaling Strategy
1. Add database (PostgreSQL/MongoDB)
2. Implement Redis for caching
3. Use queue system for AI processing (Bull/Kafka)
4. Deploy on serverless (Vercel/AWS Lambda)
5. Add CDN (CloudFront/Cloudflare)
6. Implement horizontal scaling
7. Add monitoring (DataDog/New Relic)
8. Implement graceful degradation
