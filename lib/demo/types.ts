/**
 * Type definitions for the UXercise Demo App
 * All types are scoped to the /demo mini-app
 */

export type UnitSystem = 'metric' | 'imperial';

export type BodyPart =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'full-body'
  | 'cardio'
  | 'other';

export type MovementPattern =
  | 'push'
  | 'pull'
  | 'hinge'
  | 'squat'
  | 'lunge'
  | 'carry'
  | 'rotation'
  | 'other';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'bodyweight'
  | 'machine'
  | 'band'
  | 'cable'
  | 'cardio-machine'
  | 'other';

export type SetType =
  | 'standard'
  | 'warm-up'
  | 'drop'
  | 'pyramid'
  | 'reverse-pyramid'
  | 'amrap'
  | 'emom'
  | 'tabata'
  | 'hiit-interval'
  | 'superset'
  | 'circuit';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type WorkoutTag =
  | 'Warm-Up'
  | 'Strength'
  | 'Cardio'
  | 'HIIT'
  | 'Pull'
  | 'Push'
  | 'Legs'
  | 'Core'
  | 'Full-Body'
  | 'Endurance'
  | 'Bodyweight'
  | 'Gym'
  | 'Home';

/**
 * Exercise definition from the library
 */
export interface ExerciseDefinition {
  id: string;
  name: string;
  primaryBodyPart: BodyPart;
  movementPattern?: MovementPattern;
  equipment?: Equipment;
  defaultSets?: number;
  defaultReps?: number;
  defaultTimeSeconds?: number;
  defaultRestSeconds?: number;
  defaultWeight?: number;
  tags?: string[];
}

/**
 * A single set within a workout exercise
 */
export interface WorkoutExerciseSet {
  id: string;
  setType: SetType;
  targetReps?: number;
  targetTimeSeconds?: number;
  targetWeight?: number;
  actualReps?: number;
  actualWeight?: number;
  restSeconds: number;
}

/**
 * An exercise within a workout
 */
export interface WorkoutExercise {
  id: string;
  exerciseId: string; // Reference to ExerciseDefinition
  displayName: string;
  order: number;
  sets: WorkoutExerciseSet[];
  notes?: string;
}

/**
 * A complete workout
 */
export interface Workout {
  id: string;
  name: string;
  description?: string;
  tags: WorkoutTag[];
  difficulty: Difficulty;
  estimatedDurationMinutes: number;
  scheduledDays: number[]; // 0-6 for Sun-Sat
  exercises: WorkoutExercise[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

/**
 * Per-exercise statistics in a log entry
 */
export interface ExerciseStats {
  exerciseName: string;
  volume?: number;
  setsCompleted: number;
  repsCompleted?: number;
  avgWeight?: number;
}

/**
 * A logged workout session
 */
export interface WorkoutLogEntry {
  id: string;
  workoutId: string | null;
  workoutName: string;
  performedAt: string; // ISO date
  durationMinutes: number;
  unitSystem: UnitSystem;
  totalVolume?: number;
  totalSets: number;
  totalExercises: number;
  perExerciseStats: ExerciseStats[];
}

/**
 * User profile
 */
export interface UserProfile {
  name: string;
  email?: string;
  heightCm?: number;
  weightKg?: number;
  unitSystem: UnitSystem;
  avatarDataUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Workout template
 */
export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  estimatedDurationMinutes: number;
  tags: WorkoutTag[];
  exercises: Array<{
    exerciseId: string;
    displayName: string;
    sets: Omit<WorkoutExerciseSet, 'id'>[];
    notes?: string;
  }>;
}
