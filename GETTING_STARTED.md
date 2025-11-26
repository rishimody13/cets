# Getting Started with AI Assessment Platform

## 🚀 Quick Start (5 minutes)

### 1. Set up your API key
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Anthropic API key
# Get it from: https://console.anthropic.com/
```

Your `.env` file should look like:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### 2. Install and run
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 3. Open your browser
Go to [http://localhost:3000](http://localhost:3000)

## 🎓 Try It Out

### As a Student (Recommended First)

1. **Click "Student"** on the landing page
2. **Select any assignment** (e.g., "Biology - Photosynthesis")
3. **Click "Start Recording"** (allow microphone access)
4. **Speak your answer** for 30-60 seconds. For example:
   - "Photosynthesis is the process by which plants convert sunlight into energy..."
5. **Watch concept bubbles appear** as you mention key terms
6. **Drag the bubbles** around to organize them
7. **Click "Finish and Submit"** when done
8. **View your AI feedback** with scores and detailed comments

### As a Teacher

1. **Click "Teacher"** on the landing page
2. **Select "Biology"** assignment
3. **View the demo submission** (for demonstration purposes)
4. See the AI-generated:
   - Summary transcript
   - Assessment scores
   - Detailed feedback

## 📁 Project Structure

```
CETS_2025/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # 🏠 Landing page (START HERE)
│   ├── student/                  # 🎓 Student pages
│   │   ├── dashboard/            # Assignment list
│   │   ├── assignment/[id]/      # Recording interface
│   │   └── feedback/[id]/        # Feedback display
│   ├── teacher/                  # 👨‍🏫 Teacher pages
│   │   ├── dashboard/            # Assignment overview
│   │   └── assignment/[id]/      # Student submissions
│   └── api/                      # 🤖 Claude AI integration
│       ├── extract-keywords/     # Real-time keyword extraction
│       ├── generate-feedback/    # Comprehensive feedback
│       └── submissions/[id]/     # Teacher data
├── components/                   # ♻️ Reusable components
│   ├── AssignmentCard.tsx
│   └── ConceptMap.tsx
├── lib/                         # 📚 Utilities
│   └── mockData.ts              # Sample assignments
└── types/                       # 📝 TypeScript definitions
    └── index.ts
```

## 🎯 Key Features

### ✅ What's Working
- ✅ Voice recording with Web Speech API
- ✅ Real-time keyword extraction
- ✅ Draggable concept map
- ✅ AI feedback generation (4 assessment objectives)
- ✅ Progress bars with scores
- ✅ Student and teacher dashboards
- ✅ Responsive design
- ✅ Dark mode support

### 🚧 What's Mock/Demo
- Mock assignment data (4 sample assignments)
- One demo student submission
- No database (data not persisted)
- No authentication

## 📖 Documentation

Each file serves a specific purpose:

| File | Purpose |
|------|---------|
| [README.md](README.md) | Project overview and features |
| [SETUP.md](SETUP.md) | Detailed setup instructions |
| [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) | What was built and why |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical architecture |
| [CUSTOMIZATION.md](CUSTOMIZATION.md) | How to customize the platform |
| **GETTING_STARTED.md** | You are here! |

## 🎨 Customization Quick Wins

Want to personalize it? Here are easy changes:

### Add Your Own Assignment
**File:** [lib/mockData.ts](lib/mockData.ts)
```typescript
{
  id: '5',
  subject: 'Geography',
  question: 'Explain the water cycle and its importance.',
  createdAt: '2024-01-25',
  status: 'pending'
}
```

### Change Color Scheme
**File:** [app/page.tsx](app/page.tsx:7)
```typescript
// Change from blue to purple theme
from-blue-50 to-indigo-100  →  from-purple-50 to-pink-100
```

### Modify Assessment Objectives
**File:** [app/api/generate-feedback/route.ts](app/api/generate-feedback/route.ts:23)
Change the objective names to match your curriculum.

See [CUSTOMIZATION.md](CUSTOMIZATION.md) for more options.

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality

# Useful during development
npm run build        # Check for TypeScript errors
```

## ❓ Troubleshooting

### "Cannot access microphone"
- Check browser permissions (click the 🔒 icon in address bar)
- Close other apps using the microphone
- Refresh the page

### "API key not valid"
- Verify `.env` file exists in root directory
- Check API key format: `sk-ant-...`
- Restart dev server after adding key

### Keywords not appearing
- Speak clearly and mention specific terms
- Wait 2-3 seconds after speaking
- Check browser console for errors
- Verify API key is working

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 🧪 Testing the Platform

### Test Case 1: Basic Recording
1. Record a 30-second answer about photosynthesis
2. Verify at least 2-3 concept bubbles appear
3. Check feedback shows scores for all 4 objectives

### Test Case 2: Concept Map Interaction
1. Start recording and speak
2. Wait for bubbles to appear
3. Drag bubbles to different positions
4. Verify they stay where you placed them

### Test Case 3: Teacher View
1. Go to teacher dashboard
2. Click Biology assignment
3. Verify demo submission shows
4. Check all feedback sections display

## 🚀 Next Steps

### For Learning
1. Read through [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) to understand what was built
2. Study [ARCHITECTURE.md](ARCHITECTURE.md) to see how it works
3. Explore the code, starting with [app/page.tsx](app/page.tsx)

### For Development
1. Customize the assessment objectives for your needs
2. Add more sample assignments in [lib/mockData.ts](lib/mockData.ts)
3. Experiment with different color schemes
4. Modify the AI prompts to change feedback style

### For Production
1. Add user authentication (NextAuth.js recommended)
2. Set up a database (PostgreSQL or MongoDB)
3. Implement data persistence
4. Add teacher assignment creation
5. Deploy to Vercel or similar platform

See the "Future Enhancements" section in [README.md](README.md) for more ideas.

## 💡 Tips

- **Browser:** Use Chrome or Edge for best speech recognition
- **Microphone:** Use a good microphone for better accuracy
- **Speaking:** Speak clearly and at moderate pace
- **API Usage:** Each recording uses API credits (keyword extraction + feedback)
- **Development:** Keep dev server running and refresh browser for changes

## 🆘 Need Help?

1. Check the documentation files listed above
2. Look for errors in browser console (F12)
3. Check terminal output where dev server is running
4. Verify all files are present (compare with [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md))

## 🎉 You're Ready!

You now have a fully functional AI-powered assessment platform. Start by trying it as a student, then explore the code to understand how it works!

**Pro tip:** Open the browser console (F12) while using the app to see API calls and responses in real-time.

Happy coding! 🚀
