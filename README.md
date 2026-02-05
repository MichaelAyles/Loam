# Loam

A garden planning app for tracking your plants from seed to harvest. Built with React Native and Expo, designed for UK growing conditions.

## Features

- **Dashboard** - View your plants and upcoming tasks at a glance
- **Task System** - Automatic task generation based on plant growth stages
- **Plant Profiles** - Track individual plants with visual growth timeline
- **Species Library** - Shared database of plant varieties with growing info
- **Cloud Sync** - Real-time sync across all your devices
- **Garden Sharing** - Share your garden with family and friends
- **UK Optimized** - Default frost dates for UK climate

## Species Library

Managed species database includes 14+ UK-friendly varieties:
- **Vegetables**: Tomato, Courgette, Runner Beans, Chilli, Lettuce
- **Herbs**: Basil, Coriander, Parsley
- **Fruits**: Strawberry

## Tech Stack

- **Expo SDK 54** with TypeScript
- **Expo Router** for file-based navigation
- **Convex** for real-time database and backend
- **Clerk** for authentication
- **date-fns** for date manipulation

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- [Convex account](https://convex.dev)
- [Clerk account](https://clerk.com)

### 1. Clone and Install

```bash
git clone https://github.com/MichaelAyles/Loam.git
cd Loam
npm install
```

### 2. Set up Convex

```bash
# Login to Convex
npx convex login

# Initialize Convex (creates project)
npx convex init

# Deploy the backend
npx convex dev
```

### 3. Set up Clerk

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Enable Email authentication
3. Get your publishable key from the Clerk dashboard
4. Set up JWT template for Convex:
   - Go to JWT Templates in Clerk
   - Create a new template named "convex"
   - Use the Convex template

### 4. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Fill in your values:
```
EXPO_PUBLIC_CONVEX_URL=<your convex deployment url>
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=<your clerk publishable key>
CLERK_JWT_ISSUER_DOMAIN=<your clerk jwt issuer>
```

### 5. Seed the Species Database

```bash
# In Convex dashboard, run:
npx convex run species:seedSpecies
```

### 6. Run the App

```bash
# Start Convex backend (keep running)
npx convex dev

# In another terminal, start Expo
npx expo start
```

Press `w` for web, or scan QR code with Expo Go.

## Project Structure

```
├── app/                      # Expo Router pages
│   ├── (auth)/               # Auth screens (sign-in, sign-up)
│   ├── add/                  # Add plant wizard
│   └── plant/                # Plant details
├── components/               # React components
├── convex/                   # Convex backend
│   ├── schema.ts             # Database schema
│   ├── species.ts            # Species queries/mutations
│   ├── plants.ts             # Plant queries/mutations
│   ├── users.ts              # User management
│   └── sharing.ts            # Garden sharing
├── hooks/                    # Custom React hooks
├── providers/                # React context providers
├── theme/                    # Design tokens
├── types/                    # TypeScript interfaces
└── utils/                    # Helper functions
```

## Database Schema

- **species** - Shared plant variety library (name, growing times, notes)
- **users** - User profiles and settings (frost dates, location)
- **plants** - User's plant instances linked to species
- **plantEvents** - Growth event log (sowed, germinated, etc.)
- **gardenShares** - Sharing permissions between users

## License

MIT
