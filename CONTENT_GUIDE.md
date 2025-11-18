# Content Guide

This guide provides detailed information about the data formats used in UXercise for easy content management and extension.

## Table of Contents

1. [Articles](#articles)
2. [Resources](#resources)
3. [Marketplace](#marketplace)
4. [Exercises](#exercises)

---

## Articles

**Location**: `/content/articles/`

**Format**: Markdown files with YAML frontmatter

### Article Structure

```markdown
---
slug: "unique-article-identifier"
title: "Article Title"
description: "Brief 1-2 sentence description for preview"
tags: ["tag1", "tag2", "tag3"]
publishedAt: "YYYY-MM-DD"
---

# Article Title

Your markdown content here...

## Headings

Use standard markdown:
- # H1
- ## H2
- ### H3

**Bold text** and *italic text*

- Bullet lists
- Work great

1. Numbered lists
2. Also work
```

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | URL-safe identifier (lowercase, hyphens) |
| `title` | string | Yes | Article title (shown in list and detail) |
| `description` | string | Yes | Preview description (1-2 sentences) |
| `tags` | array | Yes | List of relevant tags for filtering |
| `publishedAt` | string | Yes | Publication date (YYYY-MM-DD format) |

### Common Tags

- `beginner`, `intermediate`, `advanced`
- `strength`, `cardio`, `mobility`
- `nutrition`, `diet`, `supplements`
- `recovery`, `sleep`, `injury prevention`
- `training`, `programming`, `form`
- `home gym`, `equipment`

### Writing Guidelines

1. **Audience**: Write for beginners with no prior knowledge
2. **Tone**: Friendly, encouraging, non-judgmental
3. **Length**: 800-2000 words ideal
4. **Structure**: Use clear headings and short paragraphs
5. **Disclaimers**: Always include "not medical advice" disclaimer

### Example

```markdown
---
slug: "how-to-bench-press"
title: "How to Bench Press: A Beginner's Guide"
description: "Learn proper bench press form, common mistakes, and how to progress safely."
tags: ["beginner", "strength", "form", "chest"]
publishedAt: "2025-01-15"
---

# How to Bench Press: A Beginner's Guide

The bench press is one of the fundamental upper body pushing exercises...
```

---

## Resources

**Location**: `/data/resources.json`

**Format**: JSON array of resource objects

### Resource Object Structure

```json
{
  "title": "Resource Name",
  "description": "1-2 sentence description of what this resource provides",
  "url": "https://example.com",
  "category": "Programs",
  "tags": ["beginner", "strength", "free"],
  "affiliate": false
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Name of the resource |
| `description` | string | Yes | What the resource offers |
| `url` | string | Yes | Full URL (must include https://) |
| `category` | string | Yes | Primary category (see below) |
| `tags` | array | Yes | List of descriptive tags |
| `affiliate` | boolean | Yes | Whether link includes affiliate code |

### Valid Categories

- **Programs**: Training programs and routines
- **Education**: Articles, guides, research
- **Tools**: Calculators, trackers, apps
- **Video Content**: YouTube channels, video courses
- **Community**: Forums, subreddits, discussion groups
- **Equipment**: Gear and equipment retailers
- **Nutrition**: Diet guides, meal planning tools

### Common Tags

- **Level**: `beginner`, `intermediate`, `advanced`
- **Type**: `strength`, `bodyweight`, `cardio`, `powerlifting`
- **Equipment**: `barbell`, `dumbbell`, `home`, `gym`
- **Focus**: `nutrition`, `tracking`, `science`, `form`
- **Access**: `free`, `paid`, `app`

### Example

```json
{
  "title": "StrongLifts 5x5 Overview",
  "description": "Beginner strength program focusing on compound movements with progressive overload.",
  "url": "https://stronglifts.com/5x5/",
  "category": "Programs",
  "tags": ["beginner", "strength", "barbell", "free"],
  "affiliate": false
}
```

---

## Marketplace

**Location**: `/data/marketplace.json`

**Format**: JSON array of product objects

### Product Object Structure

```json
{
  "name": "Product Name",
  "description": "Product description and key features",
  "url": "https://example.com/product",
  "affiliate": true,
  "image": "/images/placeholder-image.svg",
  "category": "Equipment",
  "tags": ["home gym", "barbell", "olympic"]
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Product name |
| `description` | string | Yes | Features and benefits (2-3 sentences) |
| `url` | string | Yes | Product purchase URL |
| `affiliate` | boolean | Yes | Whether URL contains affiliate code |
| `image` | string | Yes | Path to product image |
| `category` | string | Yes | Product category |
| `tags` | array | Yes | Descriptive tags |

### Valid Categories

- **Equipment**: Major equipment (racks, barbells, plates, etc.)
- **Accessories**: Smaller items (belts, straps, chalk, etc.)
- **Recovery**: Recovery tools (foam rollers, massage guns, etc.)

### Common Tags

- **Equipment**: `barbell`, `dumbbell`, `rack`, `bench`, `plates`
- **Type**: `home gym`, `portable`, `adjustable`
- **Use**: `strength`, `cardio`, `mobility`, `recovery`
- **Quality**: `budget`, `mid-range`, `premium`

### Image Guidelines

- Place images in `/public/images/`
- Use SVG for placeholder images
- Recommended size: 400×300px
- Ensure images work on dark background

### Example

```json
{
  "name": "Adjustable Dumbbells Set",
  "description": "Space-saving adjustable dumbbells ranging from 5-50 lbs per hand. Perfect for home workouts with quick weight changes.",
  "url": "https://example.com/adjustable-dumbbells",
  "affiliate": true,
  "image": "/images/placeholder-dumbbells.svg",
  "category": "Equipment",
  "tags": ["home gym", "dumbbells", "adjustable", "space-saving"]
}
```

---

## Exercises

**Location**: `/data/exercises.json`

**Format**: JSON array of exercise objects

Used by the demo workout planner for exercise selection.

### Exercise Object Structure

```json
{
  "id": "unique_exercise_id",
  "name": "Exercise Name",
  "type": "push",
  "muscleGroup": "chest",
  "equipment": ["barbell", "bench"],
  "difficulty": "beginner"
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (lowercase, underscores) |
| `name` | string | Yes | Full exercise name |
| `type` | string | Yes | Movement type (see below) |
| `muscleGroup` | string | Yes | Primary muscle group |
| `equipment` | array | Yes | Required equipment |
| `difficulty` | string | Yes | Difficulty level |

### Valid Types

- `push`: Pushing movements (press, push-up, dip)
- `pull`: Pulling movements (row, pull-up, deadlift)
- `legs`: Lower body (squat, lunge, leg press)
- `core`: Core/abs (plank, crunch, leg raise)
- `cardio`: Cardio/conditioning (run, jump rope, burpees)

### Common Muscle Groups

**Upper Body**:
- `chest`, `shoulders`, `triceps`
- `back`, `biceps`, `rear delts`
- `traps`, `forearms`

**Lower Body**:
- `quads`, `hamstrings`, `glutes`
- `calves`, `adductors`

**Core**:
- `abs`, `obliques`, `core`

**Full Body**:
- `full body`, `posterior chain`

### Common Equipment

- `bodyweight`
- `barbell`, `dumbbell`, `kettlebell`, `ez bar`
- `bench`, `rack`, `pull-up bar`, `dip bars`
- `cable machine`, `leg press machine`, `leg curl machine`
- `resistance bands`, `gymnastic rings`
- `plyo box`, `jump rope`, `ab wheel`

### Difficulty Levels

- `beginner`: Suitable for new lifters
- `intermediate`: Requires 6+ months training
- `advanced`: Requires significant strength/skill

### Naming Conventions

Use descriptive names:
- ✅ "Barbell Back Squat"
- ✅ "Dumbbell Bench Press"
- ❌ "Squat" (too vague)
- ❌ "DB Bench" (use full words)

### Example

```json
{
  "id": "barbell_bench_press",
  "name": "Barbell Bench Press",
  "type": "push",
  "muscleGroup": "chest",
  "equipment": ["barbell", "bench"],
  "difficulty": "beginner"
}
```

---

## Maintenance Tips

### Validation

Before committing changes:

1. **JSON Files**: Validate JSON syntax using a linter
2. **Markdown**: Check frontmatter format
3. **Links**: Verify external URLs are valid
4. **Images**: Ensure image paths are correct

### Best Practices

1. **Consistency**: Follow existing naming patterns
2. **Tags**: Use existing tags when possible
3. **Descriptions**: Keep concise but informative
4. **URLs**: Always use `https://`
5. **Affiliate Marking**: Be transparent about affiliate links

### Adding Bulk Content

When adding multiple items:

1. Copy an existing item as a template
2. Update all fields
3. Validate JSON syntax
4. Test in development environment
5. Commit and deploy

---

## Questions?

If you have questions about content formats or need help adding content, please contact: content@uxercise.com
