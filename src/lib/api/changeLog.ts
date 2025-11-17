/**
 * Change log utilities for tracking mutations
 * All user data changes should be logged via these functions
 */

import { prisma } from '@/lib/db';
import { ActionType, EntityType } from '@/types/prisma';

export interface ChangeLogParams {
  actorId: string;
  targetUserId: string;
  actionType: ActionType;
  entityType: EntityType;
  entityId: string;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * Create a change log entry
 */
export async function logChange(params: ChangeLogParams) {
  return prisma.changeLogEntry.create({
    data: {
      actorId: params.actorId,
      targetUserId: params.targetUserId,
      actionType: params.actionType,
      entityType: params.entityType,
      entityId: params.entityId,
      description: params.description,
      metadata: params.metadata || {},
    },
  });
}

/**
 * Helper functions for common change log scenarios
 */

export async function logProgramChange(
  actorId: string,
  targetUserId: string,
  actionType: ActionType,
  programId: string,
  programName: string,
  metadata?: Record<string, any>
) {
  const actionVerb = actionType === 'CREATE' ? 'Created' : actionType === 'UPDATE' ? 'Updated' : 'Deleted';
  return logChange({
    actorId,
    targetUserId,
    actionType,
    entityType: EntityType.PROGRAM,
    entityId: programId,
    description: `${actionVerb} program '${programName}'`,
    metadata,
  });
}

export async function logWorkoutChange(
  actorId: string,
  targetUserId: string,
  actionType: ActionType,
  workoutId: string,
  workoutDate: Date,
  metadata?: Record<string, any>
) {
  const actionVerb = actionType === 'CREATE' ? 'Logged' : actionType === 'UPDATE' ? 'Updated' : 'Deleted';
  return logChange({
    actorId,
    targetUserId,
    actionType,
    entityType: EntityType.WORKOUT_SESSION,
    entityId: workoutId,
    description: `${actionVerb} workout from ${workoutDate.toLocaleDateString()}`,
    metadata,
  });
}

export async function logBodyWeightChange(
  actorId: string,
  targetUserId: string,
  actionType: ActionType,
  entryId: string,
  weight: number,
  date: Date,
  metadata?: Record<string, any>
) {
  const actionVerb = actionType === 'CREATE' ? 'Logged' : actionType === 'UPDATE' ? 'Updated' : 'Deleted';
  return logChange({
    actorId,
    targetUserId,
    actionType,
    entityType: EntityType.BODY_WEIGHT,
    entityId: entryId,
    description: `${actionVerb} body weight: ${weight}kg on ${date.toLocaleDateString()}`,
    metadata,
  });
}

export async function logExerciseChange(
  actorId: string,
  targetUserId: string,
  actionType: ActionType,
  exerciseId: string,
  exerciseName: string,
  metadata?: Record<string, any>
) {
  const actionVerb = actionType === 'CREATE' ? 'Created' : actionType === 'UPDATE' ? 'Updated' : 'Deleted';
  return logChange({
    actorId,
    targetUserId,
    actionType,
    entityType: EntityType.EXERCISE,
    entityId: exerciseId,
    description: `${actionVerb} exercise '${exerciseName}'`,
    metadata,
  });
}
