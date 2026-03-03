# JobTrackr

A job search tracker with a Kanban board interface for managing prospects through the hiring pipeline.

## Tech Stack

- **Frontend**: React (Vite) with Tailwind CSS and shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: wouter (frontend), Express (backend)
- **State**: TanStack React Query

## Project Structure

```
client/src/
  pages/home.tsx              - Main Kanban board page with columns per status
  components/
    prospect-card.tsx         - Compact prospect card with edit/delete, opens edit dialog on click
    add-prospect-form.tsx     - Form dialog for adding new prospects
    edit-prospect-form.tsx    - Form dialog for editing existing prospects (all fields including status)
    status-filter.tsx         - Status filter placeholder (intentionally disabled)
    ui/                       - shadcn/ui component library

server/
  index.ts                    - Express app setup
  db.ts                       - PostgreSQL connection pool
  routes.ts                   - API routes (GET/POST/PATCH/DELETE /api/prospects)
  storage.ts                  - Database storage interface
  prospect-helpers.ts         - Pure functions: getNextStatus, validateProspect, isTerminalStatus

shared/
  schema.ts                   - Drizzle schema + Zod validation + TypeScript types
```

## Database Schema

Single `prospects` table with fields: id, company_name, role_title, job_url, status, interest_level, notes, thank_you_sent, created_at.

Valid statuses: Bookmarked, Applied, Phone Screen, Interviewing, Offer, Rejected, Withdrawn
Valid interest levels: High, Medium, Low

## Key Design Decisions

- **Kanban board layout** - 7 columns (one per status), horizontally scrollable, cards sorted within columns
- **Editable prospects** - clicking a card opens an edit dialog to change any field including status
- **StatusFilter component exists** but is intentionally disabled - placeholder for students to implement
- **thank_you_sent checkbox is rendered but intentionally inert** on frontend - students wire it up
- **PATCH route already handles thank_you_sent -> getNextStatus logic** on the backend
- **prospect-helpers.ts** exports pure functions for testability
- Pipeline logic: getNextStatus advances status linearly, skips terminal statuses (Offer, Rejected, Withdrawn)

## API Routes

- GET /api/prospects - all prospects, ordered by created_at DESC
- POST /api/prospects - create prospect (validates with Zod)
- PATCH /api/prospects/:id - partial update, auto-advances status on thank_you_sent, validates status/interestLevel
- DELETE /api/prospects/:id - delete prospect

## Running

- `npm run dev` starts both frontend and backend
- `npm run db:push` pushes schema to database
