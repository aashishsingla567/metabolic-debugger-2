# Gemini API Integration with tRPC

This document explains how to use the new Gemini API integration that has been added to the metabolic debugger application.

## Overview

The application now uses a tRPC backend endpoint to make Gemini API calls instead of making them directly from the client side. This provides better security by keeping the API key on the server and allows for better error handling and caching.

## Setup

### 1. Environment Variables

Add your Gemini API key to your `.env.local` file:

```bash
GEMINI_API_KEY=your-gemini-api-key-here
```

You can get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 2. Dependencies

The following dependencies have been added:

- `axios` - For making HTTP requests to the Gemini API

## Usage

### Backend (tRPC Router)

The `geminiRouter` provides two main procedures:

#### 1. `generateContent`

General purpose content generation using Gemini:

```typescript
const result = await api.gemini.generateContent.mutate({
  prompt: "Explain photosynthesis in simple terms",
  systemInstruction: "You are a helpful science tutor",
});
```

#### 2. `analyzeMetabolicData`

Specialized analysis for metabolic assessment data:

```typescript
const result = await api.gemini.analyzeMetabolicData.mutate({
  reportData: {
    history: {
      sleep: "no",
      "meal-timing": "yes",
      protein: "yes",
    },
    stepData: {
      sleep: { hours: 6, quality: "poor" },
      "meal-timing": { regularity: "inconsistent" },
    },
    completedAt: "2025-12-25T08:00:00.000Z",
  },
});
```

### Client Usage

#### React Component Example

```tsx
"use client";

import React, { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/app/_components/atoms/Button";

export function MetabolicAnalysisComponent() {
  const [analysis, setAnalysis] = useState<string | null>(null);

  const analyzeData = api.gemini.analyzeMetabolicData.useMutation({
    onSuccess: (data) => {
      setAnalysis(data.analysis);
    },
    onError: (error) => {
      console.error("Analysis failed:", error);
      // Handle error or show fallback
    },
  });

  const handleAnalyze = () => {
    analyzeData.mutate({
      reportData: {
        // ... your report data
      },
    });
  };

  return (
    <div>
      <Button
        onComplete={handleAnalyze}
        label="Analyze with AI"
        holdingLabel="Analyzing..."
        theme="default"
        variant="primary"
      />

      {analysis && (
        <div className="mt-4 rounded bg-slate-800 p-4">
          <h3>AI Analysis:</h3>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
}
```

### Example Component

A complete example component is available at:

- `src/components/GeminiAnalysisExample.tsx`

This component demonstrates how to integrate the Gemini analysis into the existing metabolic debugger interface.

## Features

### Error Handling

The tRPC endpoint includes comprehensive error handling:

- **API Key Validation**: Checks for valid Gemini API key
- **Rate Limiting**: Handles API rate limit errors gracefully
- **Network Errors**: Manages network timeouts and connection issues
- **Fallback Analysis**: Provides basic analysis when the API is unavailable

### Security

- **Server-Side API Calls**: API key never exposed to client
- **Environment Variable Validation**: Ensures API key is configured
- **Request Timeout**: Prevents hanging requests (30 second timeout)

### Configuration

You can customize the Gemini API behavior in `src/server/api/routers/gemini.ts`:

- **Model**: Currently using `gemini-pro`
- **Temperature**: 0.7 (creative but focused)
- **Max Tokens**: 1024 (reasonable response length)
- **Timeout**: 30 seconds

## Migration from Client-Side Calls

If you were previously making direct Gemini API calls from the client:

### Before (Client-Side)

```typescript
// DON'T DO THIS - exposes API key
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  },
);
```

### After (Server-Side via tRPC)

```typescript
// GOOD - secure server-side call
const result = await api.gemini.generateContent.mutate({
  prompt: "Your prompt here",
});
```

## Testing

To test the integration:

1. Set up your `.env.local` file with the Gemini API key
2. Start the development server: `npm run dev`
3. Navigate to a page that uses the Gemini analysis
4. Check the browser console for any errors
5. Verify that the API calls are being made to your tRPC endpoint

## Troubleshooting

### Common Issues

1. **"Invalid Gemini API key"**
   - Verify your API key is correct
   - Check that the key has the necessary permissions
   - Ensure the key is properly set in your environment variables

2. **"Rate limit exceeded"**
   - You've hit the API rate limit
   - Wait a few minutes and try again
   - Consider implementing request caching

3. **"Failed to generate content"**
   - Check network connectivity
   - Verify the Gemini API service is operational
   - Check server logs for detailed error messages

### Debug Mode

Enable debug logging by setting:

```bash
NODE_ENV=development
```

This will show detailed error messages in the server console.

## Benefits

1. **Security**: API key never exposed to clients
2. **Performance**: Server-side caching and optimization
3. **Reliability**: Better error handling and fallbacks
4. **Scalability**: Centralized API management
5. **Monitoring**: Easier to track and analyze API usage

## Future Enhancements

Potential improvements for the integration:

- Request caching to reduce API calls
- Batch processing for multiple analyses
- Custom model fine-tuning
- Analytics and usage monitoring
- Rate limiting per user
- Response streaming for longer analyses
