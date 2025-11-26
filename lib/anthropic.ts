import Anthropic from '@anthropic-ai/sdk';
import https from 'https';

// Create a custom HTTPS agent that bypasses certificate validation in development
const httpsAgent = process.env.NODE_ENV === 'development'
  ? new https.Agent({
      rejectUnauthorized: false
    })
  : undefined;

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  // @ts-ignore - httpAgent is not in the TypeScript definition but is supported
  httpAgent: httpsAgent,
});
