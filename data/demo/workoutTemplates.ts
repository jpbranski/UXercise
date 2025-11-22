/**
 * Workout Templates for UXercise Demo App
 * Includes popular splits and challenge workouts
 */

import { WorkoutTemplate, WorkoutExerciseSet } from '@/lib/demo/types';

// Helper to create standard sets
const createStandardSets = (
  count: number,
  reps: number,
  weight: number = 0,
  rest: number = 90
): Omit<WorkoutExerciseSet, 'id'>[] => {
  return Array.from({ length: count }, (_, i) => ({
    setType: 'standard' as const,
    targetReps: reps,
    targetWeight: weight,
    restSeconds: rest,
  }));
};

// Helper to create warm-up sets
const createWarmupSets = (count: number, reps: number): Omit<WorkoutExerciseSet, 'id'>[] => {
  return Array.from({ length: count }, (_, i) => ({
    setType: 'warm-up' as const,
    targetReps: reps,
    restSeconds: 45,
  }));
};

// Helper to create HIIT interval sets
const createHIITSets = (
  count: number,
  workSeconds: number,
  rest: number = 20
): Omit<WorkoutExerciseSet, 'id'>[] => {
  return Array.from({ length: count }, (_, i) => ({
    setType: 'hiit-interval' as const,
    targetTimeSeconds: workSeconds,
    restSeconds: rest,
  }));
};

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  // ===== PUSH/PULL/LEGS SPLIT =====
  {
    id: 'push-day',
    name: 'Push Day (PPL)',
    description: 'Chest, shoulders, and triceps workout focusing on pushing movements',
    difficulty: 'Intermediate',
    estimatedDurationMinutes: 60,
    tags: ['Strength', 'Push'],
    exercises: [
      {
        exerciseId: 'bench-press',
        displayName: 'Barbell Bench Press',
        sets: createStandardSets(4, 8, 0, 120),
      },
      {
        exerciseId: 'incline-db-bench',
        displayName: 'Incline Dumbbell Press',
        sets: createStandardSets(3, 10, 0, 90),
      },
      {
        exerciseId: 'db-fly',
        displayName: 'Dumbbell Fly',
        sets: createStandardSets(3, 12, 0, 75),
      },
      {
        exerciseId: 'overhead-press',
        displayName: 'Barbell Overhead Press',
        sets: createStandardSets(4, 8, 0, 90),
      },
      {
        exerciseId: 'lateral-raise',
        displayName: 'Lateral Raise',
        sets: createStandardSets(3, 15, 0, 60),
      },
      {
        exerciseId: 'tricep-pushdown',
        displayName: 'Tricep Pushdown',
        sets: createStandardSets(3, 12, 0, 60),
      },
      {
        exerciseId: 'overhead-tricep-extension',
        displayName: 'Overhead Tricep Extension',
        sets: createStandardSets(3, 12, 0, 60),
      },
    ],
  },
  {
    id: 'pull-day',
    name: 'Pull Day (PPL)',
    description: 'Back and biceps workout focusing on pulling movements',
    difficulty: 'Intermediate',
    estimatedDurationMinutes: 60,
    tags: ['Strength', 'Pull'],
    exercises: [
      {
        exerciseId: 'deadlift',
        displayName: 'Deadlift',
        sets: createStandardSets(4, 5, 0, 180),
      },
      {
        exerciseId: 'pullup',
        displayName: 'Pull-Ups',
        sets: createStandardSets(3, 8, 0, 120),
      },
      {
        exerciseId: 'bent-row',
        displayName: 'Barbell Row',
        sets: createStandardSets(4, 8, 0, 90),
      },
      {
        exerciseId: 'lat-pulldown',
        displayName: 'Lat Pulldown',
        sets: createStandardSets(3, 12, 0, 75),
      },
      {
        exerciseId: 'face-pull',
        displayName: 'Face Pull',
        sets: createStandardSets(3, 15, 0, 60),
      },
      {
        exerciseId: 'barbell-curl',
        displayName: 'Barbell Curl',
        sets: createStandardSets(3, 10, 0, 60),
      },
      {
        exerciseId: 'hammer-curl',
        displayName: 'Hammer Curl',
        sets: createStandardSets(3, 12, 0, 60),
      },
    ],
  },
  {
    id: 'leg-day',
    name: 'Leg Day (PPL)',
    description: 'Complete lower body workout',
    difficulty: 'Intermediate',
    estimatedDurationMinutes: 60,
    tags: ['Strength', 'Legs'],
    exercises: [
      {
        exerciseId: 'squat',
        displayName: 'Barbell Squat',
        sets: createStandardSets(4, 8, 0, 180),
      },
      {
        exerciseId: 'romanian-deadlift',
        displayName: 'Romanian Deadlift',
        sets: createStandardSets(3, 10, 0, 120),
      },
      {
        exerciseId: 'leg-press',
        displayName: 'Leg Press',
        sets: createStandardSets(3, 12, 0, 90),
      },
      {
        exerciseId: 'leg-curl',
        displayName: 'Leg Curl',
        sets: createStandardSets(3, 15, 0, 60),
      },
      {
        exerciseId: 'leg-extension',
        displayName: 'Leg Extension',
        sets: createStandardSets(3, 15, 0, 60),
      },
      {
        exerciseId: 'standing-calf-raise',
        displayName: 'Standing Calf Raise',
        sets: createStandardSets(4, 20, 0, 45),
      },
    ],
  },

  // ===== UPPER/LOWER SPLIT =====
  {
    id: 'upper-body',
    name: 'Upper Body Strength',
    description: 'Complete upper body workout with compound and accessory movements',
    difficulty: 'Intermediate',
    estimatedDurationMinutes: 75,
    tags: ['Strength'],
    exercises: [
      {
        exerciseId: 'bench-press',
        displayName: 'Bench Press',
        sets: createStandardSets(4, 6, 0, 180),
      },
      {
        exerciseId: 'bent-row',
        displayName: 'Barbell Row',
        sets: createStandardSets(4, 6, 0, 120),
      },
      {
        exerciseId: 'overhead-press',
        displayName: 'Overhead Press',
        sets: createStandardSets(3, 8, 0, 90),
      },
      {
        exerciseId: 'pullup',
        displayName: 'Pull-Ups',
        sets: createStandardSets(3, 10, 0, 120),
      },
      {
        exerciseId: 'db-incline-bench',
        displayName: 'Incline Dumbbell Press',
        sets: createStandardSets(3, 10, 0, 75),
      },
      {
        exerciseId: 'cable-row',
        displayName: 'Cable Row',
        sets: createStandardSets(3, 12, 0, 75),
      },
      {
        exerciseId: 'lateral-raise',
        displayName: 'Lateral Raise',
        sets: createStandardSets(3, 15, 0, 60),
      },
      {
        exerciseId: 'barbell-curl',
        displayName: 'Barbell Curl',
        sets: createStandardSets(3, 10, 0, 60),
      },
      {
        exerciseId: 'tricep-pushdown',
        displayName: 'Tricep Pushdown',
        sets: createStandardSets(3, 12, 0, 60),
      },
    ],
  },
  {
    id: 'lower-body',
    name: 'Lower Body Strength',
    description: 'Complete lower body workout with squats, deadlifts, and accessories',
    difficulty: 'Intermediate',
    estimatedDurationMinutes: 75,
    tags: ['Strength', 'Legs'],
    exercises: [
      {
        exerciseId: 'squat',
        displayName: 'Barbell Squat',
        sets: createStandardSets(4, 6, 0, 180),
      },
      {
        exerciseId: 'deadlift',
        displayName: 'Deadlift',
        sets: createStandardSets(3, 5, 0, 180),
      },
      {
        exerciseId: 'bulgarian-split-squat',
        displayName: 'Bulgarian Split Squat',
        sets: createStandardSets(3, 10, 0, 75),
      },
      {
        exerciseId: 'leg-curl',
        displayName: 'Leg Curl',
        sets: createStandardSets(3, 12, 0, 60),
      },
      {
        exerciseId: 'leg-extension',
        displayName: 'Leg Extension',
        sets: createStandardSets(3, 12, 0, 60),
      },
      {
        exerciseId: 'hip-thrust',
        displayName: 'Hip Thrust',
        sets: createStandardSets(3, 12, 0, 75),
      },
      {
        exerciseId: 'standing-calf-raise',
        displayName: 'Standing Calf Raise',
        sets: createStandardSets(4, 20, 0, 45),
      },
    ],
  },

  // ===== FULL BODY =====
  {
    id: 'full-body-strength',
    name: 'Full Body Strength',
    description: 'Compound movements targeting all major muscle groups',
    difficulty: 'Intermediate',
    estimatedDurationMinutes: 60,
    tags: ['Strength', 'Full-Body'],
    exercises: [
      {
        exerciseId: 'squat',
        displayName: 'Barbell Squat',
        sets: createStandardSets(3, 8, 0, 180),
      },
      {
        exerciseId: 'bench-press',
        displayName: 'Bench Press',
        sets: createStandardSets(3, 8, 0, 120),
      },
      {
        exerciseId: 'bent-row',
        displayName: 'Barbell Row',
        sets: createStandardSets(3, 8, 0, 90),
      },
      {
        exerciseId: 'overhead-press',
        displayName: 'Overhead Press',
        sets: createStandardSets(3, 8, 0, 90),
      },
      {
        exerciseId: 'romanian-deadlift',
        displayName: 'Romanian Deadlift',
        sets: createStandardSets(3, 10, 0, 90),
      },
      {
        exerciseId: 'pullup',
        displayName: 'Pull-Ups',
        sets: createStandardSets(3, 8, 0, 90),
      },
    ],
  },
  {
    id: 'full-body-beginner',
    name: 'Full Body - Beginner',
    description: 'Perfect for beginners learning the basics with simple compound movements',
    difficulty: 'Beginner',
    estimatedDurationMinutes: 45,
    tags: ['Strength', 'Full-Body'],
    exercises: [
      {
        exerciseId: 'goblet-squat',
        displayName: 'Goblet Squat',
        sets: createStandardSets(3, 12, 0, 90),
      },
      {
        exerciseId: 'pushup',
        displayName: 'Push-Ups',
        sets: createStandardSets(3, 10, 0, 60),
      },
      {
        exerciseId: 'db-row',
        displayName: 'Dumbbell Row',
        sets: createStandardSets(3, 12, 0, 60),
      },
      {
        exerciseId: 'db-shoulder-press',
        displayName: 'Dumbbell Shoulder Press',
        sets: createStandardSets(3, 10, 0, 75),
      },
      {
        exerciseId: 'glute-bridge',
        displayName: 'Glute Bridge',
        sets: createStandardSets(3, 15, 0, 60),
      },
      {
        exerciseId: 'plank',
        displayName: 'Plank',
        sets: [
          { setType: 'standard', targetTimeSeconds: 30, restSeconds: 60 },
          { setType: 'standard', targetTimeSeconds: 30, restSeconds: 60 },
          { setType: 'standard', targetTimeSeconds: 30, restSeconds: 60 },
        ],
      },
    ],
  },

  // ===== HIIT WORKOUTS =====
  {
    id: 'hiit-circuit',
    name: 'HIIT Circuit Blast',
    description: 'High-intensity interval training for max calorie burn',
    difficulty: 'Advanced',
    estimatedDurationMinutes: 30,
    tags: ['HIIT', 'Cardio'],
    exercises: [
      {
        exerciseId: 'burpee',
        displayName: 'Burpees',
        sets: createHIITSets(4, 40, 20),
      },
      {
        exerciseId: 'mountain-climber',
        displayName: 'Mountain Climbers',
        sets: createHIITSets(4, 40, 20),
      },
      {
        exerciseId: 'jump-squat',
        displayName: 'Jump Squats',
        sets: createHIITSets(4, 40, 20),
      },
      {
        exerciseId: 'high-knee',
        displayName: 'High Knees',
        sets: createHIITSets(4, 40, 20),
      },
      {
        exerciseId: 'pushup',
        displayName: 'Push-Ups',
        sets: createHIITSets(4, 40, 20),
      },
      {
        exerciseId: 'plank',
        displayName: 'Plank',
        sets: createHIITSets(4, 40, 20),
      },
    ],
  },
  {
    id: 'tabata-burner',
    name: 'Tabata Fat Burner',
    description: '20 seconds on, 10 seconds off - maximum intensity',
    difficulty: 'Advanced',
    estimatedDurationMinutes: 20,
    tags: ['HIIT', 'Cardio'],
    exercises: [
      {
        exerciseId: 'burpee',
        displayName: 'Burpees',
        sets: createHIITSets(8, 20, 10),
      },
      {
        exerciseId: 'jump-squat',
        displayName: 'Jump Squats',
        sets: createHIITSets(8, 20, 10),
      },
      {
        exerciseId: 'mountain-climber',
        displayName: 'Mountain Climbers',
        sets: createHIITSets(8, 20, 10),
      },
      {
        exerciseId: 'jumping-jack',
        displayName: 'Jumping Jacks',
        sets: createHIITSets(8, 20, 10),
      },
    ],
  },

  // ===== CORE WORKOUTS =====
  {
    id: 'core-crusher',
    name: 'Core Crusher',
    description: 'Comprehensive ab and core workout',
    difficulty: 'Intermediate',
    estimatedDurationMinutes: 25,
    tags: ['Core'],
    exercises: [
      {
        exerciseId: 'plank',
        displayName: 'Plank',
        sets: [
          { setType: 'standard', targetTimeSeconds: 60, restSeconds: 45 },
          { setType: 'standard', targetTimeSeconds: 60, restSeconds: 45 },
          { setType: 'standard', targetTimeSeconds: 60, restSeconds: 45 },
        ],
      },
      {
        exerciseId: 'side-plank',
        displayName: 'Side Plank',
        sets: [
          { setType: 'standard', targetTimeSeconds: 45, restSeconds: 30 },
          { setType: 'standard', targetTimeSeconds: 45, restSeconds: 30 },
          { setType: 'standard', targetTimeSeconds: 45, restSeconds: 30 },
        ],
      },
      {
        exerciseId: 'bicycle-crunch',
        displayName: 'Bicycle Crunch',
        sets: createStandardSets(3, 20, 0, 45),
      },
      {
        exerciseId: 'russian-twist',
        displayName: 'Russian Twist',
        sets: createStandardSets(3, 30, 0, 45),
      },
      {
        exerciseId: 'leg-raise',
        displayName: 'Hanging Leg Raise',
        sets: createStandardSets(3, 12, 0, 60),
      },
      {
        exerciseId: 'mountain-climber',
        displayName: 'Mountain Climbers',
        sets: createStandardSets(3, 30, 0, 45),
      },
    ],
  },

  // ===== CHALLENGE WORKOUTS =====
  {
    id: 'murph',
    name: 'Murph',
    description: 'Hero WOD: 1 mile run, 100 pull-ups, 200 push-ups, 300 squats, 1 mile run',
    difficulty: 'Advanced',
    estimatedDurationMinutes: 60,
    tags: ['HIIT', 'Endurance', 'Bodyweight'],
    exercises: [
      {
        exerciseId: 'treadmill-run',
        displayName: '1 Mile Run',
        sets: [{ setType: 'standard', targetTimeSeconds: 600, restSeconds: 120 }],
      },
      {
        exerciseId: 'pullup',
        displayName: 'Pull-Ups',
        sets: [
          { setType: 'standard', targetReps: 100, restSeconds: 0 },
        ],
        notes: 'Partition as needed',
      },
      {
        exerciseId: 'pushup',
        displayName: 'Push-Ups',
        sets: [
          { setType: 'standard', targetReps: 200, restSeconds: 0 },
        ],
        notes: 'Partition as needed',
      },
      {
        exerciseId: 'bodyweight-squat',
        displayName: 'Air Squats',
        sets: [
          { setType: 'standard', targetReps: 300, restSeconds: 0 },
        ],
        notes: 'Partition as needed',
      },
      {
        exerciseId: 'treadmill-run',
        displayName: '1 Mile Run',
        sets: [{ setType: 'standard', targetTimeSeconds: 600, restSeconds: 0 }],
      },
    ],
  },
  {
    id: 'the-seven',
    name: 'The Seven',
    description: '7 rounds for time: 7 HSPU, 7 thrusters (135), 7 knees-to-elbows, 7 deadlifts (245), 7 burpees, 7 KB swings (72), 7 pull-ups',
    difficulty: 'Advanced',
    estimatedDurationMinutes: 45,
    tags: ['HIIT', 'Strength'],
    exercises: [
      {
        exerciseId: 'handstand-pushup',
        displayName: 'Handstand Push-Ups',
        sets: Array.from({ length: 7 }, () => ({
          setType: 'standard' as const,
          targetReps: 7,
          restSeconds: 0,
        })),
      },
      {
        exerciseId: 'thruster',
        displayName: 'Thrusters (135 lb)',
        sets: Array.from({ length: 7 }, () => ({
          setType: 'standard' as const,
          targetReps: 7,
          targetWeight: 135,
          restSeconds: 0,
        })),
      },
      {
        exerciseId: 'knees-to-elbow',
        displayName: 'Knees-to-Elbows',
        sets: Array.from({ length: 7 }, () => ({
          setType: 'standard' as const,
          targetReps: 7,
          restSeconds: 0,
        })),
      },
      {
        exerciseId: 'deadlift',
        displayName: 'Deadlifts (245 lb)',
        sets: Array.from({ length: 7 }, () => ({
          setType: 'standard' as const,
          targetReps: 7,
          targetWeight: 245,
          restSeconds: 0,
        })),
      },
      {
        exerciseId: 'burpee',
        displayName: 'Burpees',
        sets: Array.from({ length: 7 }, () => ({
          setType: 'standard' as const,
          targetReps: 7,
          restSeconds: 0,
        })),
      },
      {
        exerciseId: 'kettlebell-swing',
        displayName: 'Kettlebell Swings (72 lb)',
        sets: Array.from({ length: 7 }, () => ({
          setType: 'standard' as const,
          targetReps: 7,
          targetWeight: 72,
          restSeconds: 0,
        })),
      },
      {
        exerciseId: 'pullup',
        displayName: 'Pull-Ups',
        sets: Array.from({ length: 7 }, () => ({
          setType: 'standard' as const,
          targetReps: 7,
          restSeconds: 0,
        })),
      },
    ],
  },
  {
    id: 'fran',
    name: 'Fran',
    description: '21-15-9 reps for time: Thrusters (95 lb) and Pull-Ups',
    difficulty: 'Advanced',
    estimatedDurationMinutes: 15,
    tags: ['HIIT', 'Strength'],
    exercises: [
      {
        exerciseId: 'thruster',
        displayName: 'Thrusters (95 lb)',
        sets: [
          { setType: 'standard', targetReps: 21, targetWeight: 95, restSeconds: 0 },
        ],
      },
      {
        exerciseId: 'pullup',
        displayName: 'Pull-Ups',
        sets: [
          { setType: 'standard', targetReps: 21, restSeconds: 0 },
        ],
      },
      {
        exerciseId: 'thruster',
        displayName: 'Thrusters (95 lb)',
        sets: [
          { setType: 'standard', targetReps: 15, targetWeight: 95, restSeconds: 0 },
        ],
      },
      {
        exerciseId: 'pullup',
        displayName: 'Pull-Ups',
        sets: [
          { setType: 'standard', targetReps: 15, restSeconds: 0 },
        ],
      },
      {
        exerciseId: 'thruster',
        displayName: 'Thrusters (95 lb)',
        sets: [
          { setType: 'standard', targetReps: 9, targetWeight: 95, restSeconds: 0 },
        ],
      },
      {
        exerciseId: 'pullup',
        displayName: 'Pull-Ups',
        sets: [
          { setType: 'standard', targetReps: 9, restSeconds: 0 },
        ],
      },
    ],
  },

  // ===== BODYWEIGHT / HOME WORKOUTS =====
  {
    id: 'home-bodyweight',
    name: 'Home Bodyweight Workout',
    description: 'No equipment needed - perfect for home training',
    difficulty: 'Beginner',
    estimatedDurationMinutes: 35,
    tags: ['Bodyweight', 'Home'],
    exercises: [
      {
        exerciseId: 'bodyweight-squat',
        displayName: 'Bodyweight Squats',
        sets: createStandardSets(4, 20, 0, 60),
      },
      {
        exerciseId: 'pushup',
        displayName: 'Push-Ups',
        sets: createStandardSets(4, 15, 0, 60),
      },
      {
        exerciseId: 'lunge',
        displayName: 'Walking Lunges',
        sets: createStandardSets(3, 12, 0, 60),
      },
      {
        exerciseId: 'plank',
        displayName: 'Plank',
        sets: [
          { setType: 'standard', targetTimeSeconds: 45, restSeconds: 60 },
          { setType: 'standard', targetTimeSeconds: 45, restSeconds: 60 },
          { setType: 'standard', targetTimeSeconds: 45, restSeconds: 60 },
        ],
      },
      {
        exerciseId: 'mountain-climber',
        displayName: 'Mountain Climbers',
        sets: createStandardSets(3, 20, 0, 45),
      },
      {
        exerciseId: 'glute-bridge',
        displayName: 'Glute Bridge',
        sets: createStandardSets(3, 15, 0, 45),
      },
    ],
  },
];
