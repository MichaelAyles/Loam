# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this codebase.

## Project Overview

Loam is a React Native/Expo garden planning app for tracking plants from seed to harvest. It's designed for UK growing conditions with computed task scheduling based on frost dates.

## Tech Stack

- **Expo SDK 54** with TypeScript (strict mode)
- **Expo Router v6** for file-based navigation
- **AsyncStorage** for local persistence
- **date-fns** for date calculations

## Key Architecture Decisions

### Task Derivation (not stored)
Tasks are computed on-the-fly from plant data, not stored in the database. See `utils/tasks.ts` for the derivation logic. This ensures tasks always reflect current state.

### Plant Events as Source of Truth
Each plant has an `events` array that logs all lifecycle events. Stage dates (germinatedDate, transplantedDate, etc.) are derived from these events.

### UK-Specific Defaults
Default frost dates in `data/storage.ts`:
- Last frost: May 15
- First frost: October 15

## Common Commands

```bash
# Start development server
npx expo start

# Type check
npx tsc --noEmit

# Build for Android
npx expo run:android

# Export for production
npx expo export --platform android
```

## File Organization

- `app/` - Expo Router pages (file = route)
- `components/` - Reusable React components
- `components/ui/` - Base UI primitives (Card, Button, Input)
- `hooks/` - Custom hooks (usePlants, useSettings, useTasks)
- `data/` - seedDatabase.ts (plant templates) and storage.ts (AsyncStorage)
- `utils/` - Pure helper functions
- `types/` - TypeScript interfaces
- `theme/` - Design tokens (colors, spacing, typography)

## Design System

Colors are earthy/organic - emerald primary (#059669), amber accents (#f59e0b), slate backgrounds.

Key theme values in `theme/index.ts`:
- Border radius: 16px for cards
- Standard padding: 16-24px
- Category colors: veg=emerald, herb=violet, fruit=orange

## Adding New Plants

Add to `data/seedDatabase.ts` following the `PlantTemplate` interface:
- `daysToGermination` - from sowing
- `daysToTransplant` - after germination
- `daysToHardenOff` - duration before plant out
- `daysToPlantOut` - relative to last frost (0 = on frost date, negative = before)
- `daysToHarvest` - from plant out

## Testing Considerations

- Test task derivation with various plant stages
- Test date calculations around year boundaries
- Test with empty plant list (empty states)
- Verify AsyncStorage persistence after app restart
