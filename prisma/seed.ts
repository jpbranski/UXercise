/**
 * Prisma seed script for UXercise
 * Populates the database with:
 * - Global exercise library
 * - Demo users (admin, coach, regular user)
 * - Sample coach-client relationship
 * - Sample program with structure
 * - Sample workout sessions and body weight entries
 */

import { PrismaClient, UserRole, MuscleGroup, ScheduleType, DayOfWeek, WeekLabel, ActionType, EntityType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================================================
  // 1. Create Demo Users
  // ============================================================================
  console.log('👥 Creating demo users...');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@uxercise.dev' },
    update: {},
    create: {
      email: 'admin@uxercise.dev',
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  const coachUser = await prisma.user.upsert({
    where: { email: 'coach@uxercise.dev' },
    update: {},
    create: {
      email: 'coach@uxercise.dev',
      name: 'Coach Sarah',
      role: UserRole.COACH,
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@uxercise.dev' },
    update: {},
    create: {
      email: 'user@uxercise.dev',
      name: 'Demo User',
      role: UserRole.USER,
    },
  });

  console.log(`✅ Created users: Admin (${adminUser.id}), Coach (${coachUser.id}), User (${regularUser.id})`);

  // ============================================================================
  // 2. Create Coach-Client Relationship
  // ============================================================================
  console.log('🤝 Creating coach-client relationship...');

  await prisma.coachUserRelationship.upsert({
    where: {
      coachId_userId: {
        coachId: coachUser.id,
        userId: regularUser.id,
      },
    },
    update: {},
    create: {
      coachId: coachUser.id,
      userId: regularUser.id,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Coach-client relationship created');

  // ============================================================================
  // 3. Create Global Exercise Library
  // ============================================================================
  console.log('💪 Creating global exercise library...');

  const globalExercises = [
    // Chest
    { name: 'Barbell Bench Press', description: 'Classic flat barbell bench press', primaryMuscleGroup: MuscleGroup.CHEST, secondaryMuscleGroups: ['SHOULDERS', 'ARMS'], defaultEquipment: 'barbell', tags: ['compound', 'strength'] },
    { name: 'Dumbbell Bench Press', description: 'Flat bench press with dumbbells', primaryMuscleGroup: MuscleGroup.CHEST, secondaryMuscleGroups: ['SHOULDERS', 'ARMS'], defaultEquipment: 'dumbbell', tags: ['compound'] },
    { name: 'Incline Dumbbell Press', description: 'Upper chest focused dumbbell press', primaryMuscleGroup: MuscleGroup.CHEST, secondaryMuscleGroups: ['SHOULDERS'], defaultEquipment: 'dumbbell', tags: ['compound'] },
    { name: 'Push-ups', description: 'Classic bodyweight push-up', primaryMuscleGroup: MuscleGroup.CHEST, secondaryMuscleGroups: ['ARMS', 'CORE'], defaultEquipment: 'bodyweight', tags: ['bodyweight', 'compound'] },
    { name: 'Cable Fly', description: 'Cable chest fly for chest isolation', primaryMuscleGroup: MuscleGroup.CHEST, secondaryMuscleGroups: [], defaultEquipment: 'cable', tags: ['isolation'] },

    // Back
    { name: 'Barbell Row', description: 'Bent-over barbell row', primaryMuscleGroup: MuscleGroup.BACK, secondaryMuscleGroups: ['ARMS'], defaultEquipment: 'barbell', tags: ['compound', 'strength'] },
    { name: 'Pull-ups', description: 'Overhand grip pull-up', primaryMuscleGroup: MuscleGroup.BACK, secondaryMuscleGroups: ['ARMS'], defaultEquipment: 'bodyweight', tags: ['compound', 'bodyweight'] },
    { name: 'Lat Pulldown', description: 'Cable lat pulldown', primaryMuscleGroup: MuscleGroup.BACK, secondaryMuscleGroups: ['ARMS'], defaultEquipment: 'cable', tags: ['compound'] },
    { name: 'Seated Cable Row', description: 'Seated cable row for mid-back', primaryMuscleGroup: MuscleGroup.BACK, secondaryMuscleGroups: ['ARMS'], defaultEquipment: 'cable', tags: ['compound'] },
    { name: 'Deadlift', description: 'Conventional barbell deadlift', primaryMuscleGroup: MuscleGroup.BACK, secondaryMuscleGroups: ['LEGS', 'CORE'], defaultEquipment: 'barbell', tags: ['compound', 'strength', 'power'] },

    // Legs
    { name: 'Barbell Squat', description: 'Back squat with barbell', primaryMuscleGroup: MuscleGroup.LEGS, secondaryMuscleGroups: ['CORE'], defaultEquipment: 'barbell', tags: ['compound', 'strength'] },
    { name: 'Romanian Deadlift', description: 'RDL for hamstrings', primaryMuscleGroup: MuscleGroup.LEGS, secondaryMuscleGroups: ['BACK'], defaultEquipment: 'barbell', tags: ['compound'] },
    { name: 'Leg Press', description: 'Machine leg press', primaryMuscleGroup: MuscleGroup.LEGS, secondaryMuscleGroups: [], defaultEquipment: 'machine', tags: ['compound'] },
    { name: 'Leg Curl', description: 'Hamstring curl machine', primaryMuscleGroup: MuscleGroup.LEGS, secondaryMuscleGroups: [], defaultEquipment: 'machine', tags: ['isolation'] },
    { name: 'Leg Extension', description: 'Quadriceps extension machine', primaryMuscleGroup: MuscleGroup.LEGS, secondaryMuscleGroups: [], defaultEquipment: 'machine', tags: ['isolation'] },
    { name: 'Bulgarian Split Squat', description: 'Single-leg rear-foot-elevated squat', primaryMuscleGroup: MuscleGroup.LEGS, secondaryMuscleGroups: [], defaultEquipment: 'dumbbell', tags: ['unilateral'] },

    // Shoulders
    { name: 'Overhead Press', description: 'Standing barbell overhead press', primaryMuscleGroup: MuscleGroup.SHOULDERS, secondaryMuscleGroups: ['ARMS'], defaultEquipment: 'barbell', tags: ['compound', 'strength'] },
    { name: 'Dumbbell Shoulder Press', description: 'Seated dumbbell shoulder press', primaryMuscleGroup: MuscleGroup.SHOULDERS, secondaryMuscleGroups: ['ARMS'], defaultEquipment: 'dumbbell', tags: ['compound'] },
    { name: 'Lateral Raise', description: 'Dumbbell lateral raise for side delts', primaryMuscleGroup: MuscleGroup.SHOULDERS, secondaryMuscleGroups: [], defaultEquipment: 'dumbbell', tags: ['isolation'] },
    { name: 'Face Pull', description: 'Cable face pull for rear delts', primaryMuscleGroup: MuscleGroup.SHOULDERS, secondaryMuscleGroups: ['BACK'], defaultEquipment: 'cable', tags: ['isolation'] },

    // Arms
    { name: 'Barbell Curl', description: 'Standing barbell bicep curl', primaryMuscleGroup: MuscleGroup.ARMS, secondaryMuscleGroups: [], defaultEquipment: 'barbell', tags: ['isolation', 'biceps'] },
    { name: 'Dumbbell Curl', description: 'Alternating dumbbell curls', primaryMuscleGroup: MuscleGroup.ARMS, secondaryMuscleGroups: [], defaultEquipment: 'dumbbell', tags: ['isolation', 'biceps'] },
    { name: 'Tricep Pushdown', description: 'Cable tricep pushdown', primaryMuscleGroup: MuscleGroup.ARMS, secondaryMuscleGroups: [], defaultEquipment: 'cable', tags: ['isolation', 'triceps'] },
    { name: 'Overhead Tricep Extension', description: 'Dumbbell overhead tricep extension', primaryMuscleGroup: MuscleGroup.ARMS, secondaryMuscleGroups: [], defaultEquipment: 'dumbbell', tags: ['isolation', 'triceps'] },
    { name: 'Hammer Curl', description: 'Neutral grip dumbbell curl', primaryMuscleGroup: MuscleGroup.ARMS, secondaryMuscleGroups: [], defaultEquipment: 'dumbbell', tags: ['isolation', 'biceps'] },

    // Core
    { name: 'Plank', description: 'Front plank hold', primaryMuscleGroup: MuscleGroup.CORE, secondaryMuscleGroups: [], defaultEquipment: 'bodyweight', tags: ['bodyweight', 'isometric'] },
    { name: 'Ab Wheel Rollout', description: 'Ab wheel rollout', primaryMuscleGroup: MuscleGroup.CORE, secondaryMuscleGroups: [], defaultEquipment: 'ab wheel', tags: ['compound'] },
    { name: 'Cable Crunch', description: 'Kneeling cable crunch', primaryMuscleGroup: MuscleGroup.CORE, secondaryMuscleGroups: [], defaultEquipment: 'cable', tags: ['isolation'] },
    { name: 'Russian Twist', description: 'Seated Russian twist', primaryMuscleGroup: MuscleGroup.CORE, secondaryMuscleGroups: [], defaultEquipment: 'bodyweight', tags: ['bodyweight'] },
  ];

  const createdExercises = await Promise.all(
    globalExercises.map(ex =>
      prisma.exercise.upsert({
        where: { id: `global-${ex.name.toLowerCase().replace(/\s+/g, '-')}` },
        update: {},
        create: {
          id: `global-${ex.name.toLowerCase().replace(/\s+/g, '-')}`,
          ...ex,
          createdByUserId: null, // Global exercises
        },
      })
    )
  );

  console.log(`✅ Created ${createdExercises.length} global exercises`);

  // ============================================================================
  // 4. Create Sample Program for Regular User
  // ============================================================================
  console.log('📋 Creating sample program...');

  const program = await prisma.program.create({
    data: {
      name: 'Push/Pull/Legs Split',
      description: 'Classic 6-day PPL program for intermediate lifters',
      scheduleType: ScheduleType.WEEKLY,
      isActive: true,
      userId: regularUser.id,
      createdByCoachId: coachUser.id,
    },
  });

  // Create week
  const week = await prisma.programWeek.create({
    data: {
      programId: program.id,
      order: 1,
    },
  });

  // Create days
  const pushDay = await prisma.programDay.create({
    data: {
      programWeekId: week.id,
      dayOfWeek: DayOfWeek.MON,
      displayName: 'Push Day',
      order: 1,
    },
  });

  const pullDay = await prisma.programDay.create({
    data: {
      programWeekId: week.id,
      dayOfWeek: DayOfWeek.WED,
      displayName: 'Pull Day',
      order: 2,
    },
  });

  const legDay = await prisma.programDay.create({
    data: {
      programWeekId: week.id,
      dayOfWeek: DayOfWeek.FRI,
      displayName: 'Leg Day',
      order: 3,
    },
  });

  // Push Day structure
  const pushWarmup = await prisma.programSection.create({
    data: {
      programDayId: pushDay.id,
      name: 'Warm-up',
      order: 1,
    },
  });

  const pushMain = await prisma.programSection.create({
    data: {
      programDayId: pushDay.id,
      name: 'Main Lifts',
      order: 2,
    },
  });

  const pushAccessories = await prisma.programSection.create({
    data: {
      programDayId: pushDay.id,
      name: 'Accessories',
      order: 3,
    },
  });

  // Push Day exercises
  await prisma.programExercise.createMany({
    data: [
      { programSectionId: pushWarmup.id, exerciseId: createdExercises.find(e => e.name === 'Push-ups')!.id, targetSets: 2, targetRepsMin: 10, targetRepsMax: 15, order: 1 },
      { programSectionId: pushMain.id, exerciseId: createdExercises.find(e => e.name === 'Barbell Bench Press')!.id, targetSets: 4, targetRepsMin: 6, targetRepsMax: 8, targetRPE: 8.0, order: 1 },
      { programSectionId: pushMain.id, exerciseId: createdExercises.find(e => e.name === 'Overhead Press')!.id, targetSets: 4, targetRepsMin: 6, targetRepsMax: 8, targetRPE: 8.0, order: 2 },
      { programSectionId: pushAccessories.id, exerciseId: createdExercises.find(e => e.name === 'Incline Dumbbell Press')!.id, targetSets: 3, targetRepsMin: 10, targetRepsMax: 12, order: 1 },
      { programSectionId: pushAccessories.id, exerciseId: createdExercises.find(e => e.name === 'Lateral Raise')!.id, targetSets: 3, targetRepsMin: 12, targetRepsMax: 15, order: 2 },
      { programSectionId: pushAccessories.id, exerciseId: createdExercises.find(e => e.name === 'Tricep Pushdown')!.id, targetSets: 3, targetRepsMin: 12, targetRepsMax: 15, order: 3 },
    ],
  });

  // Pull Day structure
  const pullMain = await prisma.programSection.create({
    data: {
      programDayId: pullDay.id,
      name: 'Main Lifts',
      order: 1,
    },
  });

  const pullAccessories = await prisma.programSection.create({
    data: {
      programDayId: pullDay.id,
      name: 'Accessories',
      order: 2,
    },
  });

  // Pull Day exercises
  await prisma.programExercise.createMany({
    data: [
      { programSectionId: pullMain.id, exerciseId: createdExercises.find(e => e.name === 'Deadlift')!.id, targetSets: 3, targetRepsMin: 5, targetRepsMax: 5, targetRPE: 8.5, order: 1 },
      { programSectionId: pullMain.id, exerciseId: createdExercises.find(e => e.name === 'Barbell Row')!.id, targetSets: 4, targetRepsMin: 8, targetRepsMax: 10, targetRPE: 8.0, order: 2 },
      { programSectionId: pullAccessories.id, exerciseId: createdExercises.find(e => e.name === 'Pull-ups')!.id, targetSets: 3, targetRepsMin: 8, targetRepsMax: 12, order: 1 },
      { programSectionId: pullAccessories.id, exerciseId: createdExercises.find(e => e.name === 'Face Pull')!.id, targetSets: 3, targetRepsMin: 15, targetRepsMax: 20, order: 2 },
      { programSectionId: pullAccessories.id, exerciseId: createdExercises.find(e => e.name === 'Barbell Curl')!.id, targetSets: 3, targetRepsMin: 10, targetRepsMax: 12, order: 3 },
    ],
  });

  // Leg Day structure
  const legMain = await prisma.programSection.create({
    data: {
      programDayId: legDay.id,
      name: 'Main Lifts',
      order: 1,
    },
  });

  const legAccessories = await prisma.programSection.create({
    data: {
      programDayId: legDay.id,
      name: 'Accessories',
      order: 2,
    },
  });

  // Leg Day exercises
  await prisma.programExercise.createMany({
    data: [
      { programSectionId: legMain.id, exerciseId: createdExercises.find(e => e.name === 'Barbell Squat')!.id, targetSets: 4, targetRepsMin: 6, targetRepsMax: 8, targetRPE: 8.0, order: 1 },
      { programSectionId: legMain.id, exerciseId: createdExercises.find(e => e.name === 'Romanian Deadlift')!.id, targetSets: 3, targetRepsMin: 8, targetRepsMax: 10, order: 2 },
      { programSectionId: legAccessories.id, exerciseId: createdExercises.find(e => e.name === 'Bulgarian Split Squat')!.id, targetSets: 3, targetRepsMin: 10, targetRepsMax: 12, order: 1 },
      { programSectionId: legAccessories.id, exerciseId: createdExercises.find(e => e.name === 'Leg Curl')!.id, targetSets: 3, targetRepsMin: 12, targetRepsMax: 15, order: 2 },
      { programSectionId: legAccessories.id, exerciseId: createdExercises.find(e => e.name === 'Plank')!.id, targetSets: 3, targetRepsMin: 30, targetRepsMax: 60, order: 3, notes: 'Hold for time (seconds)' },
    ],
  });

  console.log(`✅ Created program '${program.name}' with 3 days`);

  // ============================================================================
  // 5. Create Sample Body Weight Entries
  // ============================================================================
  console.log('⚖️ Creating sample body weight entries...');

  const today = new Date();
  const bodyWeightEntries = [];

  for (let i = 30; i >= 0; i -= 7) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    bodyWeightEntries.push({
      userId: regularUser.id,
      date,
      weight: 75.0 + (Math.random() * 2 - 1), // Simulate weight fluctuation around 75kg
    });
  }

  await prisma.bodyWeightEntry.createMany({
    data: bodyWeightEntries,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${bodyWeightEntries.length} body weight entries`);

  // ============================================================================
  // 6. Create Sample Workout Sessions
  // ============================================================================
  console.log('🏋️ Creating sample workout sessions...');

  const benchPress = createdExercises.find(e => e.name === 'Barbell Bench Press')!;
  const squat = createdExercises.find(e => e.name === 'Barbell Squat')!;
  const deadlift = createdExercises.find(e => e.name === 'Deadlift')!;

  // Workout 1: Push Day (2 weeks ago)
  const workout1Date = new Date(today);
  workout1Date.setDate(workout1Date.getDate() - 14);

  const workout1 = await prisma.workoutSession.create({
    data: {
      userId: regularUser.id,
      programId: program.id,
      programDayId: pushDay.id,
      date: workout1Date,
      perceivedIntensity: 4,
      notes: 'Felt strong today!',
    },
  });

  await prisma.workoutSet.createMany({
    data: [
      // Warmup sets
      { workoutSessionId: workout1.id, exerciseId: benchPress.id, setNumber: 1, weight: 60, reps: 10, equipmentUsed: 'barbell', isWarmup: true },
      { workoutSessionId: workout1.id, exerciseId: benchPress.id, setNumber: 2, weight: 80, reps: 5, equipmentUsed: 'barbell', isWarmup: true },
      // Working sets
      { workoutSessionId: workout1.id, exerciseId: benchPress.id, setNumber: 3, weight: 100, reps: 8, equipmentUsed: 'barbell', isWarmup: false },
      { workoutSessionId: workout1.id, exerciseId: benchPress.id, setNumber: 4, weight: 100, reps: 7, equipmentUsed: 'barbell', isWarmup: false },
      { workoutSessionId: workout1.id, exerciseId: benchPress.id, setNumber: 5, weight: 100, reps: 6, equipmentUsed: 'barbell', isWarmup: false },
    ],
  });

  // Workout 2: Push Day (1 week ago)
  const workout2Date = new Date(today);
  workout2Date.setDate(workout2Date.getDate() - 7);

  const workout2 = await prisma.workoutSession.create({
    data: {
      userId: regularUser.id,
      programId: program.id,
      programDayId: pushDay.id,
      date: workout2Date,
      perceivedIntensity: 4,
    },
  });

  await prisma.workoutSet.createMany({
    data: [
      { workoutSessionId: workout2.id, exerciseId: benchPress.id, setNumber: 1, weight: 60, reps: 10, equipmentUsed: 'barbell', isWarmup: true },
      { workoutSessionId: workout2.id, exerciseId: benchPress.id, setNumber: 2, weight: 80, reps: 5, equipmentUsed: 'barbell', isWarmup: true },
      { workoutSessionId: workout2.id, exerciseId: benchPress.id, setNumber: 3, weight: 102.5, reps: 8, equipmentUsed: 'barbell', isWarmup: false },
      { workoutSessionId: workout2.id, exerciseId: benchPress.id, setNumber: 4, weight: 102.5, reps: 8, equipmentUsed: 'barbell', isWarmup: false },
      { workoutSessionId: workout2.id, exerciseId: benchPress.id, setNumber: 5, weight: 102.5, reps: 7, equipmentUsed: 'barbell', isWarmup: false },
    ],
  });

  // Workout 3: Leg Day (3 days ago)
  const workout3Date = new Date(today);
  workout3Date.setDate(workout3Date.getDate() - 3);

  const workout3 = await prisma.workoutSession.create({
    data: {
      userId: regularUser.id,
      programId: program.id,
      programDayId: legDay.id,
      date: workout3Date,
      perceivedIntensity: 5,
      notes: 'Tough session, legs on fire!',
    },
  });

  await prisma.workoutSet.createMany({
    data: [
      { workoutSessionId: workout3.id, exerciseId: squat.id, setNumber: 1, weight: 80, reps: 8, equipmentUsed: 'barbell', isWarmup: true },
      { workoutSessionId: workout3.id, exerciseId: squat.id, setNumber: 2, weight: 120, reps: 8, equipmentUsed: 'barbell', isWarmup: false },
      { workoutSessionId: workout3.id, exerciseId: squat.id, setNumber: 3, weight: 120, reps: 7, equipmentUsed: 'barbell', isWarmup: false },
      { workoutSessionId: workout3.id, exerciseId: squat.id, setNumber: 4, weight: 120, reps: 6, equipmentUsed: 'barbell', isWarmup: false },
    ],
  });

  console.log(`✅ Created 3 sample workout sessions with sets`);

  // ============================================================================
  // 7. Create Sample Change Log Entries
  // ============================================================================
  console.log('📝 Creating sample change log entries...');

  await prisma.changeLogEntry.create({
    data: {
      actorId: coachUser.id,
      targetUserId: regularUser.id,
      actionType: ActionType.CREATE,
      entityType: EntityType.PROGRAM,
      entityId: program.id,
      description: `Created program '${program.name}'`,
      metadata: {
        programName: program.name,
        scheduleType: program.scheduleType,
      },
    },
  });

  await prisma.changeLogEntry.create({
    data: {
      actorId: regularUser.id,
      targetUserId: regularUser.id,
      actionType: ActionType.CREATE,
      entityType: EntityType.WORKOUT_SESSION,
      entityId: workout1.id,
      description: 'Logged Push Day workout',
      metadata: {
        date: workout1Date.toISOString(),
        perceivedIntensity: workout1.perceivedIntensity,
      },
    },
  });

  console.log('✅ Created sample change log entries');

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
