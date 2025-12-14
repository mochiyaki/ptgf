# Pig Tim's Gaming Factory (PTGF)

A simple web-based GPT-like coding agent that allows users to describe code requirements in natural language and receive generated code responses with syntax highlighting and download options.

## Features

- Chat interface for code generation prompts
- Syntax-highlighted code blocks in responses
- Download buttons for generated code files
- Connects to local LLM at http://127.0.0.1:1234 (OpenAI-compatible API)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

## Usage

1. Ensure your local model is running on http://127.0.0.1:1234
2. Enter natural language descriptions of the code you want to generate
3. Receive responses with formatted code blocks
4. Download generated code using the buttons on each code block

## API Requirements

The local model should support the OpenAI chat completions endpoint:
- POST /v1/chat/completions
- Request: { "model": "local-model", "messages": [{ "role": "user", "content": "prompt" }] }
- Response: { "choices": [{ "message": { "content": "response text" } }] }

## Build

```bash
npm run build
```

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Axios
- React Syntax Highlighter
