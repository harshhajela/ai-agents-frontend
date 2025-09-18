# AI Agents Hub

A modern Angular 17+ application showcasing AI research agents with beautiful UI, dark/light theme support, and comprehensive search history functionality.

## 🚀 Features

- **Modern Angular 17+**: Built with standalone components, signals, and new control flow syntax
- **Research Agent**: AI-powered research assistant with web search capabilities
- **Query History**: Complete history tracking with detailed modal views
- **Architecture Visualization**: Interactive architecture diagrams
- **Responsive Design**: Mobile-first design with beautiful animations
- **Theme Support**: Full dark/light theme toggle with system preference detection
- **Production Ready**: Optimized builds with compression and caching

## 🛠️ Tech Stack

- **Frontend**: Angular 17+, TypeScript, SCSS
- **Styling**: CSS Custom Properties, Responsive Grid/Flexbox
- **State Management**: Angular Signals
- **Markdown**: ngx-markdown for content rendering
- **HTTP**: Angular HttpClient with comprehensive error handling
- **Build**: Angular CLI with production optimizations

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-agents-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy environment template
   cp src/environments/environment.ts src/environments/environment.local.ts

   # Update API URL in environment.local.ts
   # apiUrl: 'http://localhost:8000'  // Your FastAPI backend URL
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   ng serve --port 4200
   ```

5. **Open in browser**
   Navigate to `http://localhost:4200`

## 🔧 Development

### Available Scripts

```bash
# Development server
npm start                 # Starts dev server on port 4200
ng serve --port 4200     # Alternative command

# Production build
npm run build            # Creates optimized production build
ng build --configuration production

# Test production build locally
npm run serve:prod       # Serves production build locally

# Linting and formatting
npm run lint            # Runs ESLint
npm run lint:fix        # Fixes auto-fixable lint issues

# Testing
npm test               # Runs unit tests
npm run test:watch     # Runs tests in watch mode
npm run e2e           # Runs end-to-end tests
```

### Project Structure

```
src/
├── app/
│   ├── components/          # Feature components
│   │   ├── home/           # Landing page with agent showcase
│   │   ├── agent-detail/   # Agent interaction page
│   │   ├── history-modal/  # Query history modal
│   │   └── about/          # About page
│   ├── services/           # Angular services
│   │   ├── research-agent.service.ts  # API communication
│   │   └── website-data.service.ts    # Content management
│   ├── app.ts             # Root component
│   └── main.ts            # Application bootstrap
├── assets/                # Static assets
│   ├── website-data.json  # Centralized content
│   └── images/           # Application images
├── environments/         # Environment configurations
└── styles.scss          # Global styles and theme system
```

## 🌐 API Integration

### Backend Requirements

The application expects a FastAPI backend with the following endpoints:

#### Research Endpoint
```
POST /agents/research
Content-Type: application/json

Request:
{
  "query": "string"
}

Response:
{
  "final_summary": "string",
  "sources": [
    {
      "title": "string",
      "url": "string"
    }
  ]
}
```

#### History Endpoint
```
GET /agents/research/history
Content-Type: application/json

Response:
{
  "items": [
    {
      "query": "string",
      "final_summary": "string",
      "sources": [
        {
          "title": "string",
          "url": "string"
        }
      ],
      "created_at": "2025-09-18T16:47:11.341Z"
    }
  ]
}
```

### CORS Configuration

Add CORS middleware to your FastAPI backend:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://localhost:4201",
        "https://yourdomain.com"  # Add your production domain
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

## 🚀 Production Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Build output will be in dist/ai-agents-app/
```

### Environment Variables

Set the following environment variables for production:

```bash
# API URL for production
API_URL=https://your-api-domain.com
```

### Deployment Options

#### 1. Static Hosting (Netlify, Vercel, GitHub Pages)

```bash
# Build the application
npm run build

# Deploy the dist/ai-agents-app/ folder
```

**Netlify Example:**
- Build command: `npm run build`
- Publish directory: `dist/ai-agents-app`
- Environment variables: `API_URL=https://your-api-domain.com`

#### 2. Traditional Web Server (Apache, Nginx)

Copy the contents of `dist/ai-agents-app/` to your web server directory. The included `.htaccess` file provides:
- Gzip compression
- Browser caching
- Angular routing support
- Security headers

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/ai-agents-app;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;

    # Browser caching
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 3. Docker Deployment

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/ai-agents-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Performance Optimizations

The production build includes:

- **Tree Shaking**: Removes unused code
- **Minification**: Compresses JavaScript and CSS
- **Lazy Loading**: Components loaded on demand
- **Compression**: Gzip compression enabled
- **Caching**: Aggressive browser caching for static assets
- **Bundle Splitting**: Separate vendor and app bundles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Angular 17+ and modern web technologies**
