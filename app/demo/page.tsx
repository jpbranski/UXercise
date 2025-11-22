'use client';

import { useState, useEffect } from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ListIcon from '@mui/icons-material/List';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';

import DemoLayout from '@/components/demo/DemoLayout';
import Dashboard from '@/components/demo/Dashboard';
import WorkoutBuilder from '@/components/demo/WorkoutBuilder';
import WorkoutPlayer from '@/components/demo/WorkoutPlayer';
import WorkoutsList from '@/components/demo/WorkoutsList';
import LogView from '@/components/demo/LogView';
import AccountPanel from '@/components/demo/AccountPanel';

import { Workout, WorkoutLogEntry, UserProfile } from '@/lib/demo/types';
import {
  loadWorkouts,
  saveWorkouts,
  loadLogs,
  saveLogs,
  loadProfile,
  saveProfile,
  getDefaultProfile,
} from '@/lib/demo/storage';

type View = 'dashboard' | 'builder' | 'player' | 'workouts' | 'log' | 'account';

export default function DemoPage() {
  const [view, setView] = useState<View>('dashboard');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [logs, setLogs] = useState<WorkoutLogEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [playingWorkout, setPlayingWorkout] = useState<Workout | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedWorkouts = loadWorkouts();
    const loadedLogs = loadLogs();
    let loadedProfile = loadProfile();

    if (!loadedProfile) {
      loadedProfile = getDefaultProfile();
      saveProfile(loadedProfile);
    }

    setWorkouts(loadedWorkouts);
    setLogs(loadedLogs);
    setProfile(loadedProfile);
    setIsLoaded(true);
  }, []);

  // Handlers
  const handleCreateWorkout = () => {
    setEditingWorkout(null);
    setView('builder');
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
    setView('builder');
  };

  const handleSaveWorkout = (workout: Workout) => {
    const existingIndex = workouts.findIndex((w) => w.id === workout.id);
    let updatedWorkouts: Workout[];

    if (existingIndex >= 0) {
      // Update existing
      updatedWorkouts = workouts.map((w, i) => (i === existingIndex ? workout : w));
    } else {
      // Add new
      updatedWorkouts = [...workouts, workout];
    }

    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
    setView('workouts');
    setEditingWorkout(null);
  };

  const handleCancelBuilder = () => {
    setEditingWorkout(null);
    setView('dashboard');
  };

  const handleDeleteWorkout = (workoutId: string) => {
    const updatedWorkouts = workouts.filter((w) => w.id !== workoutId);
    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
  };

  const handleStartWorkout = (workout: Workout) => {
    setPlayingWorkout(workout);
    setView('player');
  };

  const handleReplayLog = (log: WorkoutLogEntry) => {
    // Find the workout and start it
    const workout = workouts.find((w) => w.id === log.workoutId);
    if (workout) {
      handleStartWorkout(workout);
    }
  };

  const handleCompleteWorkout = (log: WorkoutLogEntry) => {
    const updatedLogs = [...logs, log];
    setLogs(updatedLogs);
    saveLogs(updatedLogs);
    setPlayingWorkout(null);
    setView('dashboard');
  };

  const handleExitPlayer = () => {
    if (confirm('Exit workout? Progress will not be saved.')) {
      setPlayingWorkout(null);
      setView('dashboard');
    }
  };

  const handleUpdateSchedule = (workoutId: string, scheduledDays: number[]) => {
    const updatedWorkouts = workouts.map((w) =>
      w.id === workoutId ? { ...w, scheduledDays, updatedAt: new Date().toISOString() } : w
    );
    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  const handleNavChange = (_: any, newValue: View) => {
    // Don't allow navigation away from player without confirmation
    if (view === 'player' && playingWorkout) {
      if (confirm('Exit workout? Progress will not be saved.')) {
        setPlayingWorkout(null);
        setView(newValue);
      }
    } else {
      setView(newValue);
    }
  };

  if (!isLoaded || !profile) {
    return (
      <DemoLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          Loading...
        </Box>
      </DemoLayout>
    );
  }

  return (
    <DemoLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '80vh' }}>
        {/* Content Area */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {view === 'dashboard' && (
            <Dashboard
              workouts={workouts}
              logs={logs}
              onCreateWorkout={handleCreateWorkout}
              onStartWorkout={handleStartWorkout}
              onReplayLog={handleReplayLog}
            />
          )}

          {view === 'builder' && (
            <WorkoutBuilder
              workout={editingWorkout}
              onSave={handleSaveWorkout}
              onCancel={handleCancelBuilder}
            />
          )}

          {view === 'player' && playingWorkout && (
            <WorkoutPlayer
              workout={playingWorkout}
              unitSystem={profile.unitSystem}
              onComplete={handleCompleteWorkout}
              onExit={handleExitPlayer}
            />
          )}

          {view === 'workouts' && (
            <WorkoutsList
              workouts={workouts}
              logs={logs}
              onCreateWorkout={handleCreateWorkout}
              onEditWorkout={handleEditWorkout}
              onDeleteWorkout={handleDeleteWorkout}
              onStartWorkout={handleStartWorkout}
              onUpdateSchedule={handleUpdateSchedule}
            />
          )}

          {view === 'log' && <LogView logs={logs} />}

          {view === 'account' && <AccountPanel profile={profile} onSave={handleSaveProfile} />}
        </Box>

        {/* Bottom Navigation */}
        {view !== 'player' && (
          <Paper sx={{ position: 'sticky', bottom: 0, zIndex: 10 }} elevation={8}>
            <BottomNavigation value={view} onChange={handleNavChange} showLabels>
              <BottomNavigationAction label="Dashboard" value="dashboard" icon={<DashboardIcon />} />
              <BottomNavigationAction label="Builder" value="builder" icon={<EditIcon />} />
              <BottomNavigationAction label="Workouts" value="workouts" icon={<ListIcon />} />
              <BottomNavigationAction label="Log" value="log" icon={<AssessmentIcon />} />
              <BottomNavigationAction label="Account" value="account" icon={<PersonIcon />} />
            </BottomNavigation>
          </Paper>
        )}
      </Box>
    </DemoLayout>
  );
}
