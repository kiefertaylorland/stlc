# STLC Testing Tool

**Software Testing Life Cycle** - An intelligent testing platform with agentic coding capabilities

## Overview

STLC Testing Tool is a modern web application designed for software testers that integrates with multiple platforms and leverages open-source LLMs for intelligent test generation and management.

## Features

### 🤖 Agentic Coding Capabilities
- Natural language chat interface for test creation
- AI-powered Playwright test generation
- Intelligent test recommendations

### 🔗 Platform Integrations
- **TestRail** - Test case management
- **Atlassian Jira** - Issue tracking
- **Jam.dev** - Bug reporting
- **Figma** - Design mockups
- **Notion** - Documentation
- **GitHub** - Code repository
- **Confluence** - Team documentation

### 🎭 Playwright Framework
- Browser automation
- Test authoring and execution
- Cross-browser testing support

### 🔐 Security & OAuth
- OAuth 2.0 integration flows
- Secure credential management
- Multi-organization support

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kiefertaylorland/stlc.git
cd stlc
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Health Check
```
GET /health
```

### Status
```
GET /api/v1/status
```

### Integrations
```
GET    /api/v1/integrations           # List available integrations
POST   /api/v1/integrations/:type/authorize    # Initialize OAuth
POST   /api/v1/integrations/:type/callback     # OAuth callback
DELETE /api/v1/integrations/:type     # Disconnect integration
```

### Test Generation
```
POST /api/v1/tests/generate    # Generate Playwright test from description
POST /api/v1/tests/validate    # Validate test code
```

### Chat Interface
```
POST /api/v1/chat         # Send message to LLM
GET  /api/v1/chat/status  # Check LLM configuration
```

## Configuration

### Environment Variables

See `.env.example` for all available configuration options:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `SESSION_SECRET` - Secret for session management
- `LLM_ENDPOINT` - Open-source LLM endpoint
- `LLM_MODEL` - LLM model name

### OAuth Configuration

Configure OAuth credentials for each integration:
- `TESTRAIL_CLIENT_ID` / `TESTRAIL_CLIENT_SECRET`
- `JIRA_CLIENT_ID` / `JIRA_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `FIGMA_CLIENT_ID` / `FIGMA_CLIENT_SECRET`
- `NOTION_CLIENT_ID` / `NOTION_CLIENT_SECRET`

## Development

### Project Structure
```
src/
├── config/          # Configuration files
├── integrations/    # Integration providers
├── middleware/      # Express middleware
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types
└── index.ts         # Application entry point
```

### Scripts
- `npm run build` - Compile TypeScript
- `npm start` - Run production server
- `npm run dev` - Run development server
- `npm test` - Run tests
- `npm run lint` - Lint code

## Architecture

### Technology Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Testing**: Playwright
- **Security**: Helmet, CORS

### Design Principles
- Minimal, focused implementation
- OAuth 2.0 for secure integrations
- RESTful API design
- Extensible integration framework
- Cloud-ready architecture

## Roadmap

- [x] Project foundation and setup
- [x] Basic API endpoints
- [x] Integration framework
- [x] Playwright service
- [x] LLM chat interface
- [ ] Complete OAuth implementations
- [ ] Full LLM integration
- [ ] Frontend UI
- [ ] Database integration
- [ ] Multi-organization support
- [ ] Production deployment

## Security

- OAuth 2.0 for third-party integrations
- Environment-based secret management
- Security headers via Helmet
- Input validation and sanitization
- Regular dependency security scans (Snyk, GitGuardian)

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
