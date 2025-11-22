/**
 * LocalStorage utilities for UXercise Demo App
 * All data is stored in browser localStorage with versioned keys
 */

import { Workout, WorkoutLogEntry, UserProfile } from './types';

// Storage keys with versioning
const STORAGE_KEYS = {
  WORKOUTS: 'uxercise_demo_workouts_v1',
  LOGS: 'uxercise_demo_logs_v1',
  PROFILE: 'uxercise_demo_profile_v1',
} as const;

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Load workouts from localStorage
 */
export function loadWorkouts(): Workout[] {
  if (!isBrowser) return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load workouts from localStorage:', error);
    return [];
  }
}

/**
 * Save workouts to localStorage
 */
export function saveWorkouts(workouts: Workout[]): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  } catch (error) {
    console.error('Failed to save workouts to localStorage:', error);
  }
}

/**
 * Load workout logs from localStorage
 */
export function loadLogs(): WorkoutLogEntry[] {
  if (!isBrowser) return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load logs from localStorage:', error);
    return [];
  }
}

/**
 * Save workout logs to localStorage
 */
export function saveLogs(logs: WorkoutLogEntry[]): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save logs to localStorage:', error);
  }
}

/**
 * Load user profile from localStorage
 */
export function loadProfile(): UserProfile | null {
  if (!isBrowser) return null;

  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load profile from localStorage:', error);
    return null;
  }
}

/**
 * Save user profile to localStorage
 */
export function saveProfile(profile: UserProfile): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile to localStorage:', error);
  }
}

/**
 * Get default profile
 */
export function getDefaultProfile(): UserProfile {
  return {
    name: 'Fitness Enthusiast',
    unitSystem: 'imperial',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Clear all demo data
 */
export function clearAllDemoData(): void {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(STORAGE_KEYS.WORKOUTS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  } catch (error) {
    console.error('Failed to clear demo data:', error);
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (!isBrowser) return false;

  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
