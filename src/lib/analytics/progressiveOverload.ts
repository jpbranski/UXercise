/**
 * Progressive Overload Analytics Module
 * Calculates training volume, trends, and 1RM estimates
 */

import type { WorkoutSet, Exercise } from '@prisma/client';

export interface WorkoutSetWithExercise extends WorkoutSet {
  exercise: Exercise;
}

export interface VolumeData {
  volume: number; // Total volume (weight * reps)
  sets: number;
  totalReps: number;
  averageWeight: number;
}

export interface ExerciseVolumeByWeek {
  weekStart: Date;
  weekEnd: Date;
  volume: number;
  sets: number;
  totalReps: number;
  averageWeight: number;
  percentChange?: number; // Compared to previous week
}

export interface MuscleGroupVolume {
  muscleGroup: string;
  volume: number;
  sets: number;
  exercises: string[]; // Exercise names
}

/**
 * Calculate volume for a single set
 * For bodyweight exercises, use reps only (or could multiply by estimated bodyweight)
 */
export function calculateSetVolume(set: WorkoutSet): number {
  if (set.isWarmup) return 0; // Exclude warmup sets from volume calculations

  const weight = set.weight || 0; // 0 for bodyweight
  return weight * set.reps;
}

/**
 * Calculate total volume for an array of sets
 */
export function calculateTotalVolume(sets: WorkoutSet[]): VolumeData {
  const workingSets = sets.filter((s) => !s.isWarmup);

  const volume = workingSets.reduce((sum, set) => sum + calculateSetVolume(set), 0);
  const totalReps = workingSets.reduce((sum, set) => sum + set.reps, 0);
  const totalWeight = workingSets.reduce((sum, set) => sum + (set.weight || 0) * set.reps, 0);

  return {
    volume,
    sets: workingSets.length,
    totalReps,
    averageWeight: workingSets.length > 0 ? totalWeight / totalReps : 0,
  };
}

/**
 * Group sets by week and calculate weekly volume for an exercise
 */
export function calculateWeeklyVolume(
  sets: (WorkoutSet & { workoutSession: { date: Date } })[]
): ExerciseVolumeByWeek[] {
  // Group sets by week
  const weeklyData = new Map<string, WorkoutSet[]>();

  sets.forEach((set) => {
    const date = new Date(set.workoutSession.date);
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString();

    if (!weeklyData.has(weekKey)) {
      weeklyData.set(weekKey, []);
    }
    weeklyData.get(weekKey)!.push(set);
  });

  // Calculate volume for each week
  const weeklyVolumes: ExerciseVolumeByWeek[] = [];
  const sortedWeeks = Array.from(weeklyData.keys()).sort();

  for (let i = 0; i < sortedWeeks.length; i++) {
    const weekKey = sortedWeeks[i];
    const weekStart = new Date(weekKey);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const setsInWeek = weeklyData.get(weekKey)!;
    const volumeData = calculateTotalVolume(setsInWeek);

    let percentChange: number | undefined;
    if (i > 0) {
      const previousWeek = weeklyVolumes[i - 1];
      if (previousWeek.volume > 0) {
        percentChange = ((volumeData.volume - previousWeek.volume) / previousWeek.volume) * 100;
      }
    }

    weeklyVolumes.push({
      weekStart,
      weekEnd,
      ...volumeData,
      percentChange,
    });
  }

  return weeklyVolumes;
}

/**
 * Get the start of the week (Monday) for a given date
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Calculate volume by muscle group from sets with exercises
 */
export function calculateMuscleGroupVolume(
  setsWithExercises: WorkoutSetWithExercise[]
): MuscleGroupVolume[] {
  const muscleGroupMap = new Map<string, { volume: number; sets: number; exercises: Set<string> }>();

  setsWithExercises.forEach((set) => {
    if (set.isWarmup) return;

    const muscleGroup = set.exercise.primaryMuscleGroup;
    const volume = calculateSetVolume(set);

    if (!muscleGroupMap.has(muscleGroup)) {
      muscleGroupMap.set(muscleGroup, {
        volume: 0,
        sets: 0,
        exercises: new Set(),
      });
    }

    const data = muscleGroupMap.get(muscleGroup)!;
    data.volume += volume;
    data.sets += 1;
    data.exercises.add(set.exercise.name);
  });

  return Array.from(muscleGroupMap.entries()).map(([muscleGroup, data]) => ({
    muscleGroup,
    volume: data.volume,
    sets: data.sets,
    exercises: Array.from(data.exercises),
  }));
}

/**
 * Estimate 1 Rep Max (1RM) using Epley formula
 * Formula: weight * (1 + reps / 30)
 */
export function estimate1RMEpley(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

/**
 * Estimate 1 Rep Max (1RM) using Brzycki formula
 * Formula: weight * (36 / (37 - reps))
 */
export function estimate1RMBrzycki(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps >= 37) return weight; // Formula breaks down at high reps
  return weight * (36 / (37 - reps));
}

/**
 * Calculate the best estimated 1RM from a set of sets
 * Uses the set with the highest estimated 1RM (Epley formula)
 */
export function calculateBest1RM(sets: WorkoutSet[]): number | null {
  const workingSets = sets.filter((s) => !s.isWarmup && s.weight !== null && s.weight > 0);

  if (workingSets.length === 0) return null;

  const estimatedMaxes = workingSets.map((set) => estimate1RMEpley(set.weight!, set.reps));

  return Math.max(...estimatedMaxes);
}

/**
 * Determine if progressive overload is happening
 * Compares current week to previous week
 */
export function isProgressiveOverload(weeklyVolumes: ExerciseVolumeByWeek[]): boolean {
  if (weeklyVolumes.length < 2) return false;

  const current = weeklyVolumes[weeklyVolumes.length - 1];
  const previous = weeklyVolumes[weeklyVolumes.length - 2];

  return current.volume > previous.volume;
}

/**
 * Calculate average weekly volume over a period
 */
export function calculateAverageWeeklyVolume(weeklyVolumes: ExerciseVolumeByWeek[]): number {
  if (weeklyVolumes.length === 0) return 0;

  const totalVolume = weeklyVolumes.reduce((sum, week) => sum + week.volume, 0);
  return totalVolume / weeklyVolumes.length;
}
