# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this codebase.

## Project Overview

Loam is a React Native/Expo garden planning app for tracking plants from seed to harvest. It's designed for UK growing conditions with computed task scheduling based on frost dates.

## Tech Stack

- **Expo SDK 54** with TypeScript (strict mode)
- **Expo Router v6** for file-based navigation
- **Convex** for real-time database and backend
- **Clerk** for authentication
- **date-fns** for date calculations

## Key Architecture Decisions

### Convex Backend
All data is stored in Convex with real-time sync:
- `convex/schema.ts` - Database schema definition
- `convex/species.ts` - Shared species library (read by all users)
- `convex/plants.ts` - User's plant instances
- `convex/users.ts` - User profiles and settings
- `convex/sharing.ts` - Garden sharing between users

### Species vs Plants
- **Species** = Shared library of plant varieties (Tomato - Moneymaker, etc.)
- **Plants** = User's instances of species with their own dates/events

### Task Derivation (computed, not stored)
Tasks are computed on-the-fly from plant data in `utils/tasks.ts`. This ensures tasks always reflect current state.

### Authentication Flow
1. User signs in via Clerk (email/password)
2. Clerk session synced to Convex via `ConvexProviderWithClerk`
3. User document created/updated in Convex `users` table
4. All queries use `userId` from Convex user document

### UK-Specific Defaults
Default frost dates for new users:
- Last frost: May 15
- First frost: October 15

## Common Commands

```bash
# Start Convex backend (keep running in terminal)
npx convex dev

# Start Expo development server
npx expo start

# Generate Convex types after schema changes
npx convex codegen

# Seed species database (run once)
npx convex run species:seedSpecies

# Type check
npx tsc --noEmit
```

## File Organization

- `app/` - Expo Router pages (file = route)
- `app/(auth)/` - Auth screens (sign-in, sign-up)
- `convex/` - Backend functions and schema
- `components/` - Reusable React components
- `components/ui/` - Base UI primitives (Card, Button, Input)
- `hooks/` - Custom hooks (useAuth, usePlants, useSettings, useSpecies)
- `providers/` - React context providers (AuthProvider)
- `utils/` - Pure helper functions
- `types/` - TypeScript interfaces (legacy, being migrated to Convex types)
- `theme/` - Design tokens (colors, spacing, typography)

## Database Schema

### species (shared library)
```typescript
{
  name: string,
  category: 'veg' | 'herb' | 'fruit',
  daysToGermination: number,
  daysToTransplant: number,
  daysToHardenOff: number,
  daysToPlantOut: number,  // relative to last frost
  daysToHarvest: number,
  isApproved: boolean,     // only approved show in library
}
```

### plants (user instances)
```typescript
{
  userId: Id<'users'>,
  speciesId: Id<'species'>,
  name: string,
  sowedIndoors?: string,        // ISO date
  germinatedDate?: string,
  transplantedDate?: string,
  hardenedOffDate?: string,
  plantedOutDate?: string,
  firstHarvestDate?: string,
  // Cached from species for performance
  daysToGermination, daysToTransplant, etc.
}
```

### users
```typescript
{
  clerkId: string,
  email: string,
  location: string,
  lastFrostDate: string,
  firstFrostDate: string,
  useManualDates: boolean,
}
```

## Design System

Colors are earthy/organic - emerald primary (#059669), amber accents (#f59e0b), slate backgrounds.

Key theme values in `theme/index.ts`:
- Border radius: 16px for cards
- Standard padding: 16-24px
- Category colors: veg=emerald, herb=violet, fruit=orange

## Adding New Species

Add via Convex mutation or directly in dashboard. Schema in `convex/schema.ts`:
- `daysToGermination` - from sowing
- `daysToTransplant` - after germination
- `daysToHardenOff` - duration before plant out
- `daysToPlantOut` - relative to last frost (0 = on frost date, negative = before)
- `daysToHarvest` - from plant out

## Testing Considerations

- Test with unauthenticated state (should redirect to sign-in)
- Test task derivation with various plant stages
- Test real-time sync (open app on two devices)
- Test sharing flow (invite, accept, view shared garden)
- Verify Convex queries return expected data
