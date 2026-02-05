# Loam

A garden planning app for tracking your plants from seed to harvest. Built with React Native and Expo, designed for UK growing conditions.

## Features

- **Dashboard** - View your plants and upcoming tasks at a glance
- **Task System** - Automatic task generation based on plant growth stages (germination, transplant, hardening off, plant out, harvest)
- **Plant Profiles** - Track individual plants with visual growth timeline and event logging
- **Add Plant Wizard** - Easy 3-step flow to add new plants from the built-in seed database
- **UK Optimized** - Default frost dates for UK climate (mid-May last frost, mid-October first frost)
- **Offline First** - All data stored locally with AsyncStorage

## Plant Database

Includes 14 UK-friendly varieties:
- **Vegetables**: Tomato (Moneymaker, Gardener's Delight), Courgette, Runner Beans (Scarlet Emperor, Painted Lady), Chilli (Jalapeño, Cayenne), Lettuce (Little Gem, Butterhead)
- **Herbs**: Basil (Genovese, Thai), Coriander, Parsley
- **Fruits**: Strawberry (Cambridge Favourite)

## Tech Stack

- **Expo SDK 54** with TypeScript
- **Expo Router** for file-based navigation
- **AsyncStorage** for local persistence
- **date-fns** for date manipulation

## Getting Started

### Prerequisites

- Node.js 20+
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

**With Expo Go (limited features):**
```bash
npx expo start
# Scan QR code with Expo Go app
```

**With development build (recommended):**
```bash
# Generate native projects
npx expo prebuild

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

## Project Structure

```
loam/
├── app/                      # Expo Router pages
│   ├── _layout.tsx           # Root layout
│   ├── index.tsx             # Dashboard
│   ├── settings.tsx          # Settings
│   ├── plant/[id].tsx        # Plant profile
│   └── add/                  # Add plant wizard
├── components/               # React components
├── data/                     # Seed database & storage
├── hooks/                    # Custom React hooks
├── theme/                    # Design tokens
├── types/                    # TypeScript interfaces
└── utils/                    # Helper functions
```

## License

MIT
