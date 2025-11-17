/**
 * Prisma enum types
 * These mirror the enums defined in prisma/schema.prisma
 * Used when the Prisma client is not fully generated
 */

export enum UserRole {
  USER = 'USER',
  COACH = 'COACH',
  ADMIN = 'ADMIN',
}

export enum CoachRelationshipStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum MuscleGroup {
  CHEST = 'CHEST',
  BACK = 'BACK',
  LEGS = 'LEGS',
  SHOULDERS = 'SHOULDERS',
  ARMS = 'ARMS',
  CORE = 'CORE',
  FULL_BODY = 'FULL_BODY',
  OTHER = 'OTHER',
}

export enum ScheduleType {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
}

export enum WeekLabel {
  A = 'A',
  B = 'B',
}

export enum DayOfWeek {
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
  SUN = 'SUN',
}

export enum ActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum EntityType {
  PROGRAM = 'PROGRAM',
  PROGRAM_WEEK = 'PROGRAM_WEEK',
  PROGRAM_DAY = 'PROGRAM_DAY',
  PROGRAM_SECTION = 'PROGRAM_SECTION',
  PROGRAM_EXERCISE = 'PROGRAM_EXERCISE',
  EXERCISE = 'EXERCISE',
  WORKOUT_SESSION = 'WORKOUT_SESSION',
  WORKOUT_SET = 'WORKOUT_SET',
  BODY_WEIGHT = 'BODY_WEIGHT',
  USER = 'USER',
  COACH_RELATIONSHIP = 'COACH_RELATIONSHIP',
}
