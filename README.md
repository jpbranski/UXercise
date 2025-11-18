# UXercise

**Beginner-friendly fitness tools, built with UX in mind**

UXercise is a frontend-only fitness resource platform designed to make strength training information and tools accessible, understandable, and actionable for beginners. No backend, no database, no user accounts—just simple, practical tools and educational content.

## Features

- **Fitness Calculators**: BMI, TDEE/BMR, 1RM, plate loading, and RPE calculators
- **Resource Hub**: Curated links to 30+ training programs, tools, and educational content
- **Articles**: Educational guides covering strength training basics, nutrition, and recovery
- **Marketplace**: Curated fitness equipment and products with transparent affiliate marking
- **Demo Workout Planner**: Prototype workout planning tool with local storage (visit `/demo`)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v6
- **Styling**: CSS Modules + MUI theme
- **Content**: Markdown files with frontmatter (using gray-matter)
- **Storage**: localStorage (for demo workout planner only)

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
UXercise/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with MUI theme
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── resources/         # Resource hub
│   ├── articles/          # Article index + [slug] dynamic routes
│   ├── marketplace/       # Product marketplace
│   ├── calculators/       # Fitness calculators
│   ├── contact/           # Contact page
│   ├── privacy-policy/    # Privacy policy
│   ├── terms/             # Terms of service
│   ├── accessibility/     # Accessibility statement
│   └── demo/              # Hidden workout planner prototype
├── components/            # Reusable React components
│   ├── Header.tsx         # Main navigation header
│   └── demo/              # Demo planner components
├── content/               # Markdown content
│   └── articles/          # Article markdown files
├── data/                  # JSON data files
│   ├── resources.json     # Resource links
│   ├── marketplace.json   # Marketplace products
│   └── exercises.json     # Exercise library (60 exercises)
├── hooks/                 # Custom React hooks
│   └── useWorkoutData.ts  # localStorage hook for demo planner
├── lib/                   # Utility libraries
│   └── articles.ts        # Article loading and parsing
├── public/                # Static assets
│   ├── logo.svg           # UXercise logo
│   ├── robots.txt         # SEO robots file
│   └── images/            # Placeholder product images
├── theme/                 # MUI theme configuration
│   └── theme.ts           # Custom dark theme with orange/purple
└── types/                 # TypeScript type definitions
    └── workout.ts         # Workout data types
```

## Content Management

### Adding Articles

1. Create a new `.md` file in `/content/articles/`
2. Add frontmatter:

```md
---
slug: "your-article-slug"
title: "Your Article Title"
description: "Brief description of the article"
tags: ["tag1", "tag2"]
publishedAt: "2025-01-15"
---

Your markdown content here...
```

3. The article will automatically appear in the articles index

### Adding Resources

Edit `/data/resources.json`:

```json
{
  "title": "Resource Name",
  "description": "Description of the resource",
  "url": "https://example.com",
  "category": "Programs",
  "tags": ["beginner", "strength"],
  "affiliate": false
}
```

**Categories**: Programs, Education, Tools, Video Content, Community, Equipment, Nutrition

### Adding Marketplace Items

Edit `/data/marketplace.json`:

```json
{
  "name": "Product Name",
  "description": "Product description",
  "url": "https://example.com/product",
  "affiliate": true,
  "image": "/images/placeholder-image.svg",
  "category": "Equipment",
  "tags": ["home gym", "barbell"]
}
```

**Categories**: Equipment, Accessories, Recovery

### Adding Exercises

Edit `/data/exercises.json`:

```json
{
  "id": "exercise_id",
  "name": "Exercise Name",
  "type": "push",
  "muscleGroup": "chest",
  "equipment": ["barbell", "bench"],
  "difficulty": "beginner"
}
```

**Types**: push, pull, legs, core, cardio
**Difficulty**: beginner, intermediate, advanced

## Customization

### Theme Colors

Edit `/theme/theme.ts` to customize the color palette:

- **Primary (Orange)**: `#FF6B35` - Used for CTAs and highlights
- **Secondary (Purple)**: `#9D4EDD` - Used for accents and selection states
- **Background**: `#121212` - Near-black dark background
- **Text**: `#F5F5F5` - Off-white for readability

### Logo

Replace `/public/logo.svg` with your own logo. The logo should:
- Have a dark background
- Work well at 120×40px
- Be readable at small sizes

## Demo Workout Planner

The workout planner at `/demo` is a prototype that demonstrates:

- **Single week** or **A/B week** planning modes
- Day-by-day workout organization
- Off-day toggling
- Local storage persistence
- Mobile-first phone frame UI

**Note**: This is intentionally hidden from main navigation. Access directly at `/demo`.

### Resetting Demo Data

Click the reset button (🔄) in the demo planner header, or clear browser localStorage.

## Deployment

### Vercel (Recommended)

```bash
npm run build
```

Deploy to Vercel with zero configuration. The site is fully static and can also be hosted on:
- Netlify
- GitHub Pages
- Any static hosting service

### Build Output

The build creates a static export suitable for any hosting provider.

## Privacy & Data

UXercise does not:
- Collect user data
- Use analytics or tracking
- Require user accounts
- Store data on servers

The demo workout planner uses browser localStorage exclusively. All data remains on the user's device.

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Please ensure:
- New articles follow the frontmatter format
- JSON data is properly formatted
- Accessibility standards (WCAG AA) are maintained
- Code follows TypeScript best practices

## Disclaimer

UXercise provides general educational information only. It is not medical advice, personal training, or professional coaching. Always consult qualified healthcare and fitness professionals before beginning any exercise program.

## Contact

- Email: contact@uxercise.com
- GitHub: github.com/uxercise

---

Built with ❤️ for the fitness community
