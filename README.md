# ProperView

Real estate listing and management platform for agents to manage properties and track buyer inquiries.

## Tech Stack

- **Framework:** Next.js 14 with TypeScript
- **Database:** SQLite with Prisma ORM
- **UI:** Tailwind CSS with shadcn/ui components (supports dark/light mode)
- **Forms:** React Hook Form with Zod validation
- **Analytics:** Custom tracking with Prisma-based **storage**

## Setup & Installation

1. **Install dependencies**

   `yarn install`

2. **Setup environment variables**

   Create a `.env.local` file with:

   `DATABASE_URL="file:./dev.db"`

3. **Initialize database**

   `yarn db:push`

4. **Seed database**

   `yarn db:seed`

   This creates fake property listings with:

   - Varied listing dates (last 60 days)
   - Mixed property statuses (active, pending, sold)
   - Realistic sold/pending dates for analytics
   - Sample inquiries distributed over the last 30 days
   - 30 days of analytics data (views, unique visitors, inquiries)
   - Demo session tracking for view analytics

5. **Run the Project**

   `yarn dev`

   Open `http://localhost:3000`

6. **Or just run the quick-start script (alternative)**

   `yarn quick-start`

## Demo Access

**Agent Login:** `/login`

- **Email:** `john.doe@properview.com`
- **Password:** Any password will work

## Features

### Public Features

- **Browse Listings** (`/listings`) - Filter active properties by price, bedrooms, location
- **Property Details** (`/listings/[id]`) - View property details, submit inquiries, and view analytics
- **Analytics Tracking** - Automatic view tracking with session management for demo purposes

### Agent Dashboard

- **Mock Login** (`/login`) - Use `john.doe@properview.com` with any password for demo access
- **Dashboard** (`/dashboard`) - Overview of listings and performance
- **Manage Listings** (`/dashboard/listings`) - View, create, edit, delete properties with real-time analytics
- **View Inquiries** (`/dashboard/inquiries`) - Track buyer inquiries with read/unread status
- **Analytics** (`/dashboard/analytics`) - Comprehensive performance metrics including:
  - Total views, inquiries, and sales value
  - 30-day trend analysis
  - Top-performing properties
  - Real-time daily metrics
  - Property-specific analytics (views, inquiries, unique visitors)

## API Endpoints

### Properties

- `GET /api/properties` - List public active properties
- `GET /api/agent/properties` - List agent-owned properties
- `POST /api/properties` - Create new property
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

### Inquiries

- `POST /api/inquiries` - Submit buyer inquiry
- `GET /api/inquiries` - Get all inquiries
- `PATCH /api/inquiries/[id]/read` - Mark inquiry as read/unread

### Analytics

- `GET /api/analytics/summary` - Get comprehensive analytics dashboard data
- `POST /api/analytics/track-view` - Track property view (automatic)
- `GET /api/properties/[id]/analytics` - Get property-specific analytics

## Database

**Models:**

- **Property** - Title, price, address, bedrooms, bathrooms, description, status (active/pending/sold)
- **Inquiry** - Buyer inquiries with contact info, message, and read status
- **Agent** - Agent information (mock data)
- **ListingView** - Property view tracking with session ID, timestamp, and metadata
- **AnalyticsSummary** - Daily aggregated analytics (total views, inquiries, unique visitors)
- **PropertyAnalytics** - Property-specific daily analytics (views, inquiries, unique visitors)

**Commands:**

- `yarn db:studio` - Open Prisma Studio
- `yarn db:push --force-reset && yarn db:seed` - Reset and reseed database

## Demo Features

This application is designed for **local demonstration** purposes:

- **Simple Analytics Tracking** - Basic session IDs for demo view tracking
- **Real-time Updates** - Views and inquiries update immediately
- **Incognito-friendly** - Each new session generates unique analytics
- **30-day Historical Data** - Pre-seeded analytics for comprehensive demo

For production use, I would love to enhance with:

- **Authentication & Authorization** - JWT tokens, role-based access, multi-agent support
- **Advanced Analytics** - D3.js interactive charts, heatmaps, funnel analysis, Segment or PostHog implementation
- **User Session Management** - Proper session tracking, bot detection, IP filtering
- **Deployment & Infrastructure** - Vercel/AWS deployment, CDN, database scaling
- **Real-time Features** - WebSocket notifications, live chat, instant updates
- **SEO & Performance** - Server-side rendering, image optimization, caching
- **CRM Integration** - Lead management, email automation, follow-up workflows
- **Mobile App** - React Native companion app for agents
- **Third-party APIs** - MLS integration, mortgage calculators, neighborhood data
