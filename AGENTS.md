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
- **ENCAPSULATION**: All database queries MUST be encapsulated in helper functions in `src/db/*.ts` files (one file per entity, e.g., `Deck.ts`, `Card.ts`). Read helpers stay in `src/db/`, write operations go in `src/app/actions/*.ts` Server Actions. Never write raw queries directly in Server Components or Server Actions.

## Auth
- Clerk (configured in `.env` and `src/app/layout.tsx`)
- userId comes from Clerk, no local users table
- **SECURITY**: Users can ONLY access their own data - always filter queries by Clerk userId

## Data Access
- Read data: Server Components only
- Write data (insert/update/delete): Server Actions only
- **VALIDATION**: All input data validated with Zod with schemas in `src/lib/schemas.ts`
- **TYPES**: All server action params must have TypeScript types (NOT FormData)

## UI Components
- **ONLY use shadcn/ui components** for all UI elements
- Built-in components in `src/components/ui/`
- If needed, create new components following shadcn/ui patterns (CVA + cn)
- **Dark mode is default**: Project uses dark theme by default (`dark` class on html)
- Avoid hardcoded dark colors (e.g., `text-black`, `bg-zinc-900`) on dark backgrounds
- Use semantic colors (e.g., `text-foreground`, `text-muted-foreground`, `bg-card`) for compatibility