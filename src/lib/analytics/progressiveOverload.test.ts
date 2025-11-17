/**
 * Tests for progressive overload analytics functions
 */

import {
  calculateSetVolume,
  calculateTotalVolume,
  calculateWeeklyVolume,
  estimate1RMEpley,
  estimate1RMBrzycki,
  calculateBest1RM,
  isProgressiveOverload,
} from './progressiveOverload';
import type { WorkoutSet } from '@prisma/client';

describe('Progressive Overload Analytics', () => {
  describe('calculateSetVolume', () => {
    it('should calculate volume correctly for a working set', () => {
      const set: WorkoutSet = {
        id: '1',
        workoutSessionId: 'session1',
        exerciseId: 'ex1',
        programExerciseId: null,
        setNumber: 1,
        weight: 100,
        reps: 10,
        equipmentUsed: 'barbell',
        isWarmup: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(calculateSetVolume(set)).toBe(1000);
    });

    it('should return 0 for warmup sets', () => {
      const set: WorkoutSet = {
        id: '1',
        workoutSessionId: 'session1',
        exerciseId: 'ex1',
        programExerciseId: null,
        setNumber: 1,
        weight: 60,
        reps: 10,
        equipmentUsed: 'barbell',
        isWarmup: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(calculateSetVolume(set)).toBe(0);
    });

    it('should handle bodyweight exercises (null weight)', () => {
      const set: WorkoutSet = {
        id: '1',
        workoutSessionId: 'session1',
        exerciseId: 'ex1',
        programExerciseId: null,
        setNumber: 1,
        weight: null,
        reps: 15,
        equipmentUsed: 'bodyweight',
        isWarmup: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(calculateSetVolume(set)).toBe(0);
    });
  });

  describe('calculateTotalVolume', () => {
    it('should calculate total volume across multiple sets', () => {
      const sets: WorkoutSet[] = [
        {
          id: '1',
          workoutSessionId: 'session1',
          exerciseId: 'ex1',
          programExerciseId: null,
          setNumber: 1,
          weight: 100,
          reps: 10,
          equipmentUsed: 'barbell',
          isWarmup: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          workoutSessionId: 'session1',
          exerciseId: 'ex1',
          programExerciseId: null,
          setNumber: 2,
          weight: 100,
          reps: 9,
          equipmentUsed: 'barbell',
          isWarmup: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          workoutSessionId: 'session1',
          exerciseId: 'ex1',
          programExerciseId: null,
          setNumber: 3,
          weight: 100,
          reps: 8,
          equipmentUsed: 'barbell',
          isWarmup: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const result = calculateTotalVolume(sets);

      expect(result.volume).toBe(2700); // 1000 + 900 + 800
      expect(result.sets).toBe(3);
      expect(result.totalReps).toBe(27);
    });

    it('should exclude warmup sets from volume calculations', () => {
      const sets: WorkoutSet[] = [
        {
          id: '1',
          workoutSessionId: 'session1',
          exerciseId: 'ex1',
          programExerciseId: null,
          setNumber: 1,
          weight: 60,
          reps: 10,
          equipmentUsed: 'barbell',
          isWarmup: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          workoutSessionId: 'session1',
          exerciseId: 'ex1',
          programExerciseId: null,
          setNumber: 2,
          weight: 100,
          reps: 10,
          equipmentUsed: 'barbell',
          isWarmup: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const result = calculateTotalVolume(sets);

      expect(result.volume).toBe(1000); // Only the working set
      expect(result.sets).toBe(1);
    });
  });

  describe('1RM estimation', () => {
    it('should estimate 1RM using Epley formula', () => {
      const result = estimate1RMEpley(100, 10);
      expect(result).toBeCloseTo(133.33, 1);
    });

    it('should estimate 1RM using Brzycki formula', () => {
      const result = estimate1RMBrzycki(100, 10);
      expect(result).toBeCloseTo(133.33, 1);
    });

    it('should return weight for 1 rep', () => {
      expect(estimate1RMEpley(100, 1)).toBe(100);
      expect(estimate1RMBrzycki(100, 1)).toBe(100);
    });
  });

  describe('calculateBest1RM', () => {
    it('should find the highest estimated 1RM from sets', () => {
      const sets: WorkoutSet[] = [
        {
          id: '1',
          workoutSessionId: 'session1',
          exerciseId: 'ex1',
          programExerciseId: null,
          setNumber: 1,
          weight: 100,
          reps: 10,
          equipmentUsed: 'barbell',
          isWarmup: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          workoutSessionId: 'session1',
          exerciseId: 'ex1',
          programExerciseId: null,
          setNumber: 2,
          weight: 120,
          reps: 5,
          equipmentUsed: 'barbell',
          isWarmup: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const result = calculateBest1RM(sets);
      expect(result).toBeGreaterThan(0);
    });

    it('should return null when no valid sets', () => {
      const result = calculateBest1RM([]);
      expect(result).toBeNull();
    });
  });

  describe('isProgressiveOverload', () => {
    it('should detect progressive overload when volume increases', () => {
      const weeklyVolumes = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
          volume: 5000,
          sets: 10,
          totalReps: 50,
          averageWeight: 100,
        },
        {
          weekStart: new Date('2024-01-08'),
          weekEnd: new Date('2024-01-14'),
          volume: 5500,
          sets: 10,
          totalReps: 50,
          averageWeight: 110,
          percentChange: 10,
        },
      ];

      expect(isProgressiveOverload(weeklyVolumes)).toBe(true);
    });

    it('should return false when volume decreases', () => {
      const weeklyVolumes = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
          volume: 5500,
          sets: 10,
          totalReps: 50,
          averageWeight: 110,
        },
        {
          weekStart: new Date('2024-01-08'),
          weekEnd: new Date('2024-01-14'),
          volume: 5000,
          sets: 10,
          totalReps: 50,
          averageWeight: 100,
          percentChange: -9.1,
        },
      ];

      expect(isProgressiveOverload(weeklyVolumes)).toBe(false);
    });

    it('should return false when there is only one week', () => {
      const weeklyVolumes = [
        {
          weekStart: new Date('2024-01-01'),
          weekEnd: new Date('2024-01-07'),
          volume: 5000,
          sets: 10,
          totalReps: 50,
          averageWeight: 100,
        },
      ];

      expect(isProgressiveOverload(weeklyVolumes)).toBe(false);
    });
  });
});
