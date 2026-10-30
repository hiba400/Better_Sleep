# Better Sleep - Sleep Tracking Application

**Next.js 16 | React 19 | TypeScript | Spring Boot | Docker**

A modern sleep tracking application designed to help users monitor and improve their sleep patterns with intelligent analytics and personalized insights.

## Project Overview

Better Sleep is a full-stack web application that enables users to track sleep duration, quality, and trends through an intuitive interface. The application features advanced analytics, AI-powered insights, smart goals, and evidence-based sleep advice.

### Key Features

- **Sleep Tracking**: Log sleep entries with duration, quality, and wake times
- **Advanced Analytics**: Visualize sleep patterns with charts and trend analysis
- **Smart Goals**: Set and track sleep goals with milestone tracking
- **Sleep Advice**: Receive evidence-based tips for improving sleep quality
- **User Authentication**: Secure login and signup functionality
- **Responsive Design**: Mobile-friendly interface with modern UI
- **Docker Support**: Containerized deployment for consistent environments

## Technology Stack

### Frontend
- **Framework**: Next.js 16.0.7 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4.1.9
- **Components**: Radix UI (complete component library)
- **State Management**: React Hook Form, Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

### Backend
- **Framework**: Spring Boot 4.0.0
- **Language**: Java 17
- **Build Tool**: Maven
- **Architecture**: REST API

### DevOps
- **Containerization**: Docker, Docker Compose
- **Version Control**: Git

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│                    https://better-sleep-lilac.vercel.app      │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP (optional)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Spring Boot)                     │
│                    http://localhost:8080/api/test           │
└─────────────────────────────────────────────────────────────┘
```

## Repository Structure

```text
Better_Sleep/
├── backend/                        # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/
│   │               └── sleepbetter/
│   │                   └── backend/
│   │                       ├── BackendApplication.java
│   │                       └── controller/
│   │                           └── TestController.java
│   ├── pom.xml                # Maven configuration
│   ├── Dockerfile             # Backend Docker configuration
│   └── .gitignore
├── frontend/                       # Next.js frontend
│   ├── app/                   # Next.js App Router pages
│   │   ├── advice/            # Sleep advice page
│   │   ├── alerts/            # Smart alerts page
│   │   ├── analytics/         # Analytics dashboard
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── goals/             # Sleep goals page
│   │   ├── profile/           # User profile page
│   │   ├── sleep-entry/       # Sleep logging page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css       # Global styles
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── public/                # Static assets
│   ├── scripts/               # Build scripts
│   ├── styles/                # Style configurations
│   ├── Dockerfile             # Frontend Docker configuration
│   ├── docker-compose.yml     # Frontend Docker Compose
│   ├── next.config.mjs        # Next.js configuration
│   ├── package.json           # Frontend dependencies
│   ├── tsconfig.json          # TypeScript configuration
│   └── README.md              # Frontend documentation (French)
└── .gitignore
```

## Installation

### Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.6+
- Docker (optional, for containerized deployment)

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   Frontend will start on `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run with Maven**
   ```bash
   ./mvnw spring-boot:run
   ```

   Backend will start on `http://localhost:8080`

3. **Test endpoints**
   - Root: `http://localhost:8080/` → "Backend fonctionne !"
   - API Test: `http://localhost:8080/api/test` → "API test OK !"

### Docker Setup

1. **Frontend only (frontend directory)**
   ```bash
   cd frontend
   docker-compose up --build
   ```

   Access at `http://localhost:3000`

2. **Stop containers**
   ```bash
   docker-compose down
   ```

## Deployment

### Frontend
The frontend is deployed to Vercel:
- **Live URL**: https://better-sleep-lilac.vercel.app
- **Build Process**: Automated via Vercel
- **Environment**: Production

### Backend
The backend is a minimal Spring Boot application demonstrating REST API functionality. For production deployment:
- Package as JAR: `./mvnw clean package`
- Run JAR: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
- Default port: 8080

## Features by Page

### Landing Page (`/`)
- Hero section with value proposition
- Feature highlights (Analytics, AI Insights, Smart Goals, Advice, Logging, Alerts)
- Statistics section
- Call-to-action for signup
- Professional footer

### Authentication (`/auth/login`, `/auth/signup`)
- User login and signup
- Token-based authentication
- Local storage for session management

### Dashboard (`/dashboard`)
- Main user dashboard
- Sleep entry overview
- Quick access to features

### Sleep Entry (`/sleep-entry`)
- Log sleep duration and quality
- Intuitive form interface
- Smart defaults

### Analytics (`/analytics`)
- Sleep pattern visualizations
- Trend analysis
- Charts and graphs

### Goals (`/goals`)
- Set sleep goals
- Track progress
- Milestone tracking

### Advice (`/advice`)
- Evidence-based sleep tips
- Personalized recommendations
- Wellness strategies

### Alerts (`/alerts`)
- Smart notifications
- Sleep quality alerts
- Health pattern monitoring

### Profile (`/profile`)
- User profile management
- Account settings

## API Endpoints

### Backend API

| Endpoint | Method | Response |
|----------|--------|----------|
| `/` | GET | "Backend fonctionne !" |
| `/api/test` | GET | "API test OK !" |

Note: The backend is currently a minimal demonstration with test endpoints. Full API implementation for sleep data management is planned for future development.

## Configuration

### Frontend Environment Variables

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
CHOKIDAR_USEPOLLING=true
```

### Backend Configuration

The backend uses Spring Boot's default configuration:
- Port: 8080
- Context path: /
- Profile: development (default)

## Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend Development

```bash
cd backend
./mvnw spring-boot:run    # Run Spring Boot application
./mvnw clean package       # Build JAR file
./mvnw test                # Run tests
```

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Frontend UI | ✅ Complete | Full Next.js application with all pages |
| Authentication | ✅ Complete | Login/signup with token storage |
| Sleep Tracking UI | ✅ Complete | Sleep entry form and dashboard |
| Analytics UI | ✅ Complete | Visualization components |
| Goals UI | ✅ Complete | Goal setting and tracking |
| Advice UI | ✅ Complete | Sleep advice page |
| Alerts UI | ✅ Complete | Smart alerts page |
| Backend API | ⏳ Minimal | Only test endpoints implemented |
| Database | ⏳ Not Implemented | No database persistence yet |
| Backend-Frontend Integration | ⏳ Not Implemented | Frontend currently standalone |

## Future Enhancements

- Complete backend API with full CRUD operations
- Database integration (PostgreSQL or MongoDB)
- User authentication with JWT
- Sleep data persistence
- Advanced analytics with backend processing
- Real-time notifications
- API integration with external sleep tracking devices
- Machine learning for sleep pattern analysis

## Troubleshooting

### Frontend Won't Start

1. Check Node.js version (18+ required)
2. Ensure dependencies are installed: `npm install`
3. Check port 3000 is not in use
4. Clear Next.js cache: `rm -rf .next`

### Backend Won't Start

1. Check Java version (17+ required)
2. Ensure Maven wrapper is executable
3. Check port 8080 is not in use
4. Verify Spring Boot dependencies in pom.xml

### Docker Issues

1. Ensure Docker is running
2. Check Docker daemon is accessible
3. Verify no port conflicts (3000, 8080)
4. Check volume mount permissions

## License

No license has been selected for this project. All rights reserved to the author.

## Author

**Hiba Ben Adou**

Computer Engineering Student – ENSA Tangier

This project demonstrates full-stack web development with Next.js, React, TypeScript, Spring Boot, and Docker, with a focus on modern UI design and user experience.
