export interface ExerciseSet {
  sets: number;
  reps: number;
  weight?: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

export interface StandardSection {
  id: string;
  type: 'standard';
  name: string;
  exercises: Exercise[];
}

export interface IntervalSection {
  id: string;
  type: 'interval';
  name: string;
  intervalCount?: number;
  toFailure: boolean;
  duration?: number; // in seconds
  exercises: Exercise[];
}

export type Section = StandardSection | IntervalSection;

export interface WorkoutDay {
  isOffDay: boolean;
  sections: Section[];
}

export interface WorkoutWeek {
  monday: WorkoutDay;
  tuesday: WorkoutDay;
  wednesday: WorkoutDay;
  thursday: WorkoutDay;
  friday: WorkoutDay;
  saturday: WorkoutDay;
  sunday: WorkoutDay;
}

export interface WorkoutData {
  mode: 'single' | 'ab';
  singleWeek: WorkoutWeek;
  aWeek: WorkoutWeek;
  bWeek: WorkoutWeek;
}

export const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
export type DayOfWeek = typeof DAYS_OF_WEEK[number];
