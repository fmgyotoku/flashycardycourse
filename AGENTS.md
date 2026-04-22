# FlashyCardy - Flashcard App

## Commands
- `npm run dev` - Start dev server (http://localhost:3000)
- `npm run build` - Production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Database
- **ALWAYS use Drizzle** for all database interactions (schema + queries from `src/db/schema.ts`)
- Schema: `drizzle-orm/pg-core` tables in `src/db/schema.ts`
- Migrations: `drizzle/` folder
- Generate: `npx drizzle-kit generate`, Apply: `npx drizzle-kit migrate`

## Auth
- Clerk (configured in `.env` and `src/app/layout.tsx`)
- userId comes from Clerk, no local users table
- **SECURITY**: Users can ONLY access their own data - always filter queries by Clerk userId

## Data Access
- Read data: Server Components only
- Write data (insert/update/delete): Server Actions only
- **VALIDATION**: All input data validated with Zod
- **TYPES**: All server action params must have TypeScript types (NOT FormData)