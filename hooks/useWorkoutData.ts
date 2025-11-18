'use client';

import { useState, useEffect } from 'react';
import { WorkoutData, WorkoutWeek, WorkoutDay } from '@/types/workout';

const STORAGE_KEY = 'uxercise-demo-workout';

const createEmptyDay = (): WorkoutDay => ({
  isOffDay: false,
  sections: [],
});

const createEmptyWeek = (): WorkoutWeek => ({
  monday: createEmptyDay(),
  tuesday: createEmptyDay(),
  wednesday: createEmptyDay(),
  thursday: createEmptyDay(),
  friday: createEmptyDay(),
  saturday: createEmptyDay(),
  sunday: createEmptyDay(),
});

const createDefaultData = (): WorkoutData => ({
  mode: 'single',
  singleWeek: {
    monday: {
      isOffDay: false,
      sections: [
        {
          id: 'default-1',
          type: 'standard',
          name: 'Upper Body Push',
          exercises: [
            {
              id: 'bench_press',
              name: 'Barbell Bench Press',
              sets: [{ sets: 3, reps: 8, weight: 135 }],
            },
            {
              id: 'overhead_press',
              name: 'Overhead Press',
              sets: [{ sets: 3, reps: 8, weight: 95 }],
            },
          ],
        },
      ],
    },
    tuesday: { isOffDay: true, sections: [] },
    wednesday: {
      isOffDay: false,
      sections: [
        {
          id: 'default-2',
          type: 'standard',
          name: 'Lower Body',
          exercises: [
            {
              id: 'barbell_squat',
              name: 'Barbell Back Squat',
              sets: [{ sets: 3, reps: 5, weight: 185 }],
            },
            {
              id: 'romanian_deadlift',
              name: 'Romanian Deadlift',
              sets: [{ sets: 3, reps: 10, weight: 135 }],
            },
          ],
        },
      ],
    },
    thursday: { isOffDay: true, sections: [] },
    friday: {
      isOffDay: false,
      sections: [
        {
          id: 'default-3',
          type: 'standard',
          name: 'Upper Body Pull',
          exercises: [
            {
              id: 'barbell_row',
              name: 'Barbell Row',
              sets: [{ sets: 3, reps: 8, weight: 135 }],
            },
            {
              id: 'pull_ups',
              name: 'Pull-ups',
              sets: [{ sets: 3, reps: 8 }],
            },
          ],
        },
      ],
    },
    saturday: { isOffDay: true, sections: [] },
    sunday: { isOffDay: true, sections: [] },
  },
  aWeek: createEmptyWeek(),
  bWeek: createEmptyWeek(),
});

export function useWorkoutData() {
  const [data, setData] = useState<WorkoutData>(createDefaultData());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
      }
    } catch (error) {
      console.error('Error loading workout data:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving workout data:', error);
      }
    }
  }, [data, isLoaded]);

  const resetData = () => {
    const defaultData = createDefaultData();
    setData(defaultData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  };

  return {
    data,
    setData,
    resetData,
    isLoaded,
  };
}
