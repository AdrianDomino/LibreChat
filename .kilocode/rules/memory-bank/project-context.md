# LibreChat Project Context

## Project Overview
LibreChat is a unified chat interface for multiple AI providers, designed to provide a seamless experience across different AI services while maintaining user privacy and control.

## Current State
- **Version**: 0.7.x (actively developed)
- **Active Contributors**: 50+ developers
- **Supported Providers**: 15+ AI providers
- **GitHub Stars**: 5,000+
- **Production Deployments**: 100+ instances worldwide

## Key Features
- Multi-provider AI integration (OpenAI, Google, Anthropic, Azure, etc.)
- Advanced conversation management and organization
- File processing capabilities (images, documents, audio)
- Real-time collaboration features
- Plugin system for extensibility
- User authentication and role-based access control

## Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Redis
- **AI Integration**: REST APIs, WebSocket connections
- **File Processing**: PDF.js, Tesseract.js, FFmpeg, Sharp
- **Deployment**: Docker, Kubernetes, CI/CD

## Development Environment
- **Node.js**: 18.x+
- **Package Manager**: npm/yarn
- **Database**: MongoDB with Mongoose
- **Cache**: Redis for session management
- **Testing**: Jest, Cypress
- **Linting**: ESLint, Prettier

## Key Directories
- `client/` - React frontend application
- `api/` - Node.js backend API
- `config/` - Configuration files
- `packages/` - Shared packages and utilities

## Environment Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `OPENAI_API_KEY` - OpenAI API key
- `REDIS_URI` - Redis connection string
- Various provider-specific API keys

## Quick Start Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test