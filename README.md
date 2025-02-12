# Ollama Chat Enigma

A modern chat application built with Spring Boot and React, featuring a clean UI with dark/light mode support.

## Features

- 🌓 Dark/Light mode toggle
- 💬 Real-time chat functionality
- 🎨 Clean and modern UI using Tailwind CSS
- 📝 New chat creation
- 🗂️ Chat history (Maybe, Coming Soon)

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Heroicons
- Vite

### Backend
- Spring Boot
- WebSocket
- Java 21

## Disclaimer

This project is primarily generated using GitHub Copilot, with minimal manual code modifications. It serves as a demonstration of AI-assisted development capabilities. While the core functionality and structure were suggested by GitHub Copilot, some modifications and customizations were made by hand.

Please note: The current UI is not fully responsive and is provided as a proof-of-concept.

## Getting Started

### Prerequisites
- Node.js (>= 16)
- Java 21
- Maven
- Ollama (for local LLM support)
- Deepseek-coder-1.3b-instruct model installed in Ollama

### Before Running
1. Install Ollama from https://ollama.com/
2. Pull the Deepseek model:
```bash
ollama pull deepseek-r1:1.5b
```

### Running the Application

1. **Backend**
```bash
cd backend
mvn spring-boot:run
```

2. **Frontend**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`


## License

[MIT](LICENSE)
