# Troubleshooting Guide

## SSL Certificate Issues

### Problem: "unable to get local issuer certificate"

**Error message:**
```
Error: Connection error.
[cause]: [Error [FetchError]: request to https://api.anthropic.com/v1/messages failed,
reason: unable to get local issuer certificate]
```

**Cause:** This happens in certain development environments (corporate networks, firewalls, or proxy settings) where SSL certificates cannot be properly verified.

**Solution:** The application has been configured to handle this automatically in development mode. The fix is in [lib/anthropic.ts](lib/anthropic.ts) which disables SSL verification when `NODE_ENV=development`.

**If the issue persists:**

1. **Option 1: Set NODE_TLS_REJECT_UNAUTHORIZED (Quick fix for development)**
   ```bash
   # Add to your .env file
   NODE_TLS_REJECT_UNAUTHORIZED=0
   ```

   ⚠️ **Warning:** Only use this in development! Never in production!

2. **Option 2: Use a VPN or different network**
   - If you're on a corporate network, try using a personal network
   - Some corporate firewalls intercept SSL traffic

3. **Option 3: Configure your system's CA certificates**
   ```bash
   # macOS
   export NODE_EXTRA_CA_CERTS=/path/to/your/ca-certificates.crt

   # Windows
   set NODE_EXTRA_CA_CERTS=C:\path\to\ca-certificates.crt
   ```

---

## Microphone Access Issues

### Problem: "Cannot access microphone"

**Possible causes:**
1. Browser permissions not granted
2. Another application is using the microphone
3. Browser doesn't support Web Speech API

**Solutions:**

1. **Check browser permissions:**
   - Click the 🔒 icon in the address bar
   - Ensure microphone is set to "Allow"
   - Refresh the page

2. **Close other applications:**
   - Close Zoom, Skype, Discord, or other apps using the mic
   - Check system settings for which apps have microphone access

3. **Try a different browser:**
   - Chrome: Full support ✅
   - Edge: Full support ✅
   - Safari: Full support ✅
   - Firefox: Limited support ⚠️

4. **Check system permissions:**
   - **macOS:** System Preferences → Security & Privacy → Microphone
   - **Windows:** Settings → Privacy → Microphone

---

## API Key Issues

### Problem: "API key not valid" or no response from API

**Solutions:**

1. **Verify .env file exists:**
   ```bash
   ls -la .env
   ```
   If it doesn't exist, create it:
   ```bash
   cp .env.example .env
   ```

2. **Check API key format:**
   - Should start with `sk-ant-`
   - No spaces or quotes around the key
   - Example: `ANTHROPIC_API_KEY=sk-ant-api03-xxxxx`

3. **Restart the dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

4. **Verify API key is valid:**
   - Go to https://console.anthropic.com/
   - Check your API keys
   - Generate a new one if needed

5. **Check API key has credits:**
   - Visit https://console.anthropic.com/settings/billing
   - Ensure you have available credits

---

## Build Errors

### Problem: TypeScript errors or build failures

**Solutions:**

1. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node.js version:**
   ```bash
   node --version
   # Should be 18.x or higher
   ```

4. **Update Next.js:**
   ```bash
   npm install next@latest
   ```

---

## Speech Recognition Not Working

### Problem: No text appears when speaking

**Solutions:**

1. **Check browser support:**
   - Open browser console (F12)
   - Look for error messages
   - Try Chrome or Edge for best support

2. **Verify microphone is working:**
   - Test in another application
   - Check system audio settings
   - Try a different microphone

3. **Check internet connection:**
   - Speech recognition requires internet
   - Test your connection speed
   - Try a different network

4. **Speak clearly:**
   - Speak at moderate pace
   - Use clear pronunciation
   - Avoid background noise

---

## Keywords Not Appearing

### Problem: Concept bubbles don't show up

**Possible causes:**
1. API key issue
2. Network connectivity
3. Speaking too fast
4. API rate limits

**Solutions:**

1. **Check browser console:**
   ```
   Open DevTools (F12) → Console tab
   Look for errors from /api/extract-keywords
   ```

2. **Verify API is working:**
   - Check if API key is set
   - Look for error messages in terminal
   - Check Anthropic API status: https://status.anthropic.com/

3. **Speak in phrases:**
   - Pause between sentences
   - Give the API time to process
   - Wait 2-3 seconds after speaking

4. **Check rate limits:**
   - Free tier has rate limits
   - Wait a minute if you hit the limit
   - Check your API usage in Anthropic console

---

## Feedback Not Generating

### Problem: Submit button doesn't work or feedback doesn't appear

**Solutions:**

1. **Check transcript length:**
   - Speak for at least 30 seconds
   - Ensure transcript is not empty
   - Check browser console for errors

2. **Verify API key:**
   - Ensure API key is valid
   - Check API credits are available
   - Look for 401/403 errors in console

3. **Check network:**
   - Ensure stable internet connection
   - Check for firewall blocking API calls
   - Try a different network

4. **Wait for processing:**
   - AI generation takes 5-10 seconds
   - Don't refresh the page
   - Look for "Processing..." indicator

---

## Port Already in Use

### Problem: "Port 3000 is in use"

**Solutions:**

1. **Kill the process on port 3000:**
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9

   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Use a different port:**
   ```bash
   PORT=3001 npm run dev
   ```

3. **Find what's using the port:**
   ```bash
   # macOS/Linux
   lsof -i :3000

   # Windows
   netstat -ano | findstr :3000
   ```

---

## Dark Mode Issues

### Problem: Colors look wrong or dark mode not working

**Solutions:**

1. **Check browser settings:**
   - Browser may be forcing a color scheme
   - Try toggling browser dark mode

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear site data in DevTools

3. **Check Tailwind CSS:**
   - Verify [tailwind.config.ts](tailwind.config.ts) is correct
   - Check [globals.css](app/globals.css) for color variables

---

## Performance Issues

### Problem: App is slow or laggy

**Solutions:**

1. **Reduce keyword extraction frequency:**
   - See [CUSTOMIZATION.md](CUSTOMIZATION.md) for debouncing
   - Limit concept bubbles to fewer keywords

2. **Check browser performance:**
   - Close unnecessary tabs
   - Restart browser
   - Use Chrome for best performance

3. **Check system resources:**
   - Monitor CPU/RAM usage
   - Close heavy applications
   - Try on a different device

4. **Network speed:**
   - Test internet speed
   - Use wired connection if possible
   - Switch to faster network

---

## Database/Persistence Issues

### Problem: Data doesn't persist between sessions

**Expected behavior:** This is normal! The app uses mock data with no database.

**Solutions:**

If you need persistence:
1. Add a database (PostgreSQL, MongoDB, etc.)
2. Update API routes to save/fetch from database
3. Implement data models
4. See "Future Enhancements" in [README.md](README.md)

---

## Common Questions

### Q: Why do I need an API key?
**A:** The Anthropic API (Claude AI) requires authentication. Get a free key at https://console.anthropic.com/

### Q: Does this work offline?
**A:** No, it requires internet for both speech recognition and AI processing.

### Q: Can I use a different AI model?
**A:** Yes! See [CUSTOMIZATION.md](CUSTOMIZATION.md) for how to change the model.

### Q: Why are there only 4 assignments?
**A:** They're mock data for demo purposes. Add more in [lib/mockData.ts](lib/mockData.ts)

### Q: Can I deploy this to production?
**A:** Yes, but you should add authentication, a database, and proper error handling first.

### Q: How much does the API cost?
**A:** Check current pricing at https://www.anthropic.com/pricing
   - Keyword extraction: ~$0.001-0.003 per recording
   - Feedback generation: ~$0.01-0.03 per submission

---

## Getting More Help

1. **Check the logs:**
   - Browser console (F12)
   - Terminal where dev server is running
   - Network tab in DevTools

2. **Review documentation:**
   - [README.md](README.md) - Overview
   - [SETUP.md](SETUP.md) - Setup guide
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details

3. **Test with minimal example:**
   - Test API key with curl
   - Try recording in a different browser
   - Test on a different network

4. **Report an issue:**
   - Include error messages
   - Describe what you were doing
   - Include browser/OS information

---

## Quick Diagnosis Checklist

When something doesn't work, check:

- [ ] Is `.env` file present with valid API key?
- [ ] Is dev server running without errors?
- [ ] Is browser console showing errors?
- [ ] Did you grant microphone permissions?
- [ ] Is internet connection stable?
- [ ] Are you using Chrome, Edge, or Safari?
- [ ] Did you restart the server after changing .env?
- [ ] Is port 3000 available?
- [ ] Do you have API credits available?
- [ ] Are you speaking clearly and long enough?

If all else fails, try:
```bash
# Nuclear option - complete reset
rm -rf node_modules .next
npm install
npm run dev
```
