# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   ```

   Get your API key from: https://console.anthropic.com/

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Testing the Platform

### As a Student:
1. Click "Student" on the landing page
2. Select any assignment card
3. Click "Start Recording" (allow microphone access when prompted)
4. Speak your answer to the question
5. Watch concept bubbles appear in real-time
6. Click "Finish and Submit" to get AI feedback

### As a Teacher:
1. Click "Teacher" on the landing page
2. Select an assignment card
3. View the demo student submission with AI-generated transcript and feedback

## Important Notes

### Browser Compatibility
- **Speech Recognition**: Works best in Chrome, Edge, and Safari
- **Microphone Access**: You'll need to grant permission when prompted

### API Requirements
- You need a valid Anthropic API key
- The free tier should be sufficient for testing
- API calls are made for:
  - Real-time keyword extraction (frequent, small requests)
  - Final feedback generation (larger request on submission)
  - Teacher view summary generation

### Known Limitations
- This is a demo/prototype - no database or persistent storage
- Only mock assignments are available
- Only one demo submission exists (for assignment ID "1")
- Speech recognition requires internet connection

## Troubleshooting

### "Cannot access microphone"
- Check browser permissions for microphone access
- Ensure no other application is using the microphone
- Try refreshing the page

### "API key not valid"
- Verify your `.env` file exists in the root directory
- Check that your API key is correct
- Restart the development server after adding the key

### "Failed to extract keywords" or "Failed to generate feedback"
- Check your API key is valid
- Ensure you have internet connection
- Check the browser console for detailed error messages

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key for Claude |

## Next Steps

To extend this platform for production:

1. **Add Authentication**: Implement user login/registration
2. **Add Database**: Store assignments, submissions, and users
3. **Create Assignment Management**: Allow teachers to create/edit assignments
4. **Implement File Upload**: Allow students to upload audio files
5. **Add Analytics**: Track student progress over time
6. **Improve Error Handling**: Better error messages and recovery
7. **Add Tests**: Unit and integration tests
8. **Deploy**: Deploy to Vercel, Netlify, or your preferred platform
