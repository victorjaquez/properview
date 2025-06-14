# ProperView

Real estate listing and management platform for agents to manage properties and track buyer inquiries.

## Tech Stack

- **Framework:** Next.js 15 with TypeScript
- **Database:** SQLite with Prisma ORM
- **UI:** Tailwind CSS with shadcn/ui components (supports dark/light mode)
- **Forms:** React Hook Form with Zod validation
- **Analytics:** Custom tracking with Prisma-based **storage**
- **Testing:** Jest for unit tests
- **Linting:** ESLint for code quality and consistency

## Reasoning

I chose Next.js 15 with TypeScript because I wanted a single codebase for both frontend and backend. I also needed API routes to keep me in one context, and I love how file-based routing maps directly to my pages and APIs. For data storage I picked SQLite with Prisma since I wanted minimal setup and appreciate Prisma’s type-safe queries for rapid prototyping. On the UI side I went with Tailwind to style components quickly and consistently, and I chose shadcn/ui for its polished components that support dark and light modes out of the box. For forms I used React Hook Form and Zod because I needed fast forms and reliable validation. If I’d had more time I would have liked to add pagination or infinite scroll, image uploads, and a gallery view.

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
   - Historical analytics data (views, unique visitors, inquiries)
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
  - Historical trend analysis
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

## Testing

**Commands:**

- `yarn test` - Run all unit tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage report

## Demo Features

This application is designed for **local demonstration** purposes:

- **Simple Analytics Tracking** - Basic session IDs for demo view tracking
- **Real-time Updates** - Views and inquiries update immediately
- **Incognito-friendly** - Each new session generates unique analytics
- **Historical Data** - Pre-seeded analytics for comprehensive demo

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

## Screenshots
<img width="500" alt="Screenshot 2025-06-13 at 22 35 57" src="https://github.com/user-attachments/assets/d5db12f9-99c3-41ee-af2c-38814cf182d8" />
<img width="500" alt="Screenshot 2025-06-13 at 22 36 03" src="https://github.com/user-attachments/assets/22b9f21d-d01c-4f49-96d0-281aeea20564" />
<img width="500" alt="Screenshot 2025-06-13 at 22 36 11" src="https://github.com/user-attachments/assets/64736b6b-0945-4adc-93dc-4e31b89e9a42" />
<img width="500" alt="Screenshot 2025-06-13 at 22 36 16" src="https://github.com/user-attachments/assets/7d5b9d2b-e33f-4dac-84ae-01550e15890c" />
<img width="500" alt="Screenshot 2025-06-13 at 22 36 32" src="https://github.com/user-attachments/assets/1e2c77ed-0d70-41fb-83ae-00af5be2146f" />
<img width="500" alt="Screenshot 2025-06-13 at 22 38 24" src="https://github.com/user-attachments/assets/54cf8a27-0aa8-430f-993a-ed7c2f9a0c96" />
<img width="500" alt="Screenshot 2025-06-13 at 22 36 48" src="https://github.com/user-attachments/assets/f45f8836-366d-4617-b929-188cdd75b6fe" />
<img width="500" alt="Screenshot 2025-06-13 at 22 36 53" src="https://github.com/user-attachments/assets/87ba86dc-4821-4751-be8c-8924f9d60e4e" />
<img width="500" alt="Screenshot 2025-06-13 at 22 37 04" src="https://github.com/user-attachments/assets/bdfa7953-cbb5-4ec5-a197-93c454a6b5e5" />
<img width="500" alt="Screenshot 2025-06-13 at 22 37 14" src="https://github.com/user-attachments/assets/e2d6e69c-a35b-4850-ad41-a8c0f49caf36" />
<img width="416" alt="Screenshot 2025-06-13 at 22 40 04" src="https://github.com/user-attachments/assets/44d7ca33-5084-4150-9543-18b01acc423c" />
<img width="416" alt="Screenshot 2025-06-13 at 22 40 13" src="https://github.com/user-attachments/assets/ba8db8e2-29c2-4c40-9639-e3135e57ad5b" />


