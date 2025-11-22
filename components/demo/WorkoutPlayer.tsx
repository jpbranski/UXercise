'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Workout, WorkoutExerciseSet, WorkoutLogEntry, ExerciseStats } from '@/lib/demo/types';
import { EXERCISE_LIBRARY } from '@/data/demo/exercises';

interface WorkoutPlayerProps {
  workout: Workout;
  unitSystem: 'metric' | 'imperial';
  onComplete: (log: WorkoutLogEntry) => void;
  onExit: () => void;
}

interface FlatSet {
  exerciseIndex: number;
  exerciseName: string;
  exerciseId: string;
  setIndex: number;
  set: WorkoutExerciseSet & { actualReps?: number; actualWeight?: number };
  tag?: string;
}

export default function WorkoutPlayer({ workout, unitSystem, onComplete, onExit }: WorkoutPlayerProps) {
  const [flatSets, setFlatSets] = useState<FlatSet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime] = useState(Date.now());
  const [showComplete, setShowComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Flatten all sets for easy navigation
  useEffect(() => {
    const flattened: FlatSet[] = [];
    workout.exercises.forEach((exercise, exIdx) => {
      const exerciseDef = EXERCISE_LIBRARY.find((e) => e.id === exercise.exerciseId);
      const tag = workout.tags[0]; // Use first tag for the phase label

      exercise.sets.forEach((set, setIdx) => {
        flattened.push({
          exerciseIndex: exIdx,
          exerciseName: exercise.displayName,
          exerciseId: exercise.exerciseId,
          setIndex: setIdx,
          set: { ...set, actualReps: set.targetReps, actualWeight: set.targetWeight },
          tag,
        });
      });
    });
    setFlatSets(flattened);
  }, [workout]);

  const currentFlatSet = flatSets[currentIndex];

  // Timer logic
  useEffect(() => {
    if (currentFlatSet?.set.targetTimeSeconds) {
      setTimeRemaining(currentFlatSet.set.targetTimeSeconds);
    }
  }, [currentIndex, currentFlatSet]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            // Auto-advance to next set
            handleNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentIndex < flatSets.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(false);
    } else {
      // Workout complete
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(false);
    }
  };

  const handleAdjustReps = (delta: number) => {
    setFlatSets(
      flatSets.map((fs, idx) =>
        idx === currentIndex
          ? {
              ...fs,
              set: {
                ...fs.set,
                actualReps: Math.max(0, (fs.set.actualReps || 0) + delta),
              },
            }
          : fs
      )
    );
  };

  const handleAdjustWeight = (delta: number) => {
    setFlatSets(
      flatSets.map((fs, idx) =>
        idx === currentIndex
          ? {
              ...fs,
              set: {
                ...fs.set,
                actualWeight: Math.max(0, (fs.set.actualWeight || 0) + delta),
              },
            }
          : fs
      )
    );
  };

  const handleComplete = () => {
    const endTime = Date.now();
    const durationMinutes = Math.round((endTime - startTime) / 60000);

    // Calculate per-exercise stats
    const exerciseStatsMap: Record<string, ExerciseStats> = {};
    flatSets.forEach((fs) => {
      if (!exerciseStatsMap[fs.exerciseId]) {
        exerciseStatsMap[fs.exerciseId] = {
          exerciseName: fs.exerciseName,
          setsCompleted: 0,
          repsCompleted: 0,
          volume: 0,
          avgWeight: 0,
        };
      }

      const stats = exerciseStatsMap[fs.exerciseId];
      stats.setsCompleted += 1;
      if (fs.set.actualReps) {
        stats.repsCompleted = (stats.repsCompleted || 0) + fs.set.actualReps;
      }
      if (fs.set.actualReps && fs.set.actualWeight) {
        stats.volume = (stats.volume || 0) + fs.set.actualReps * fs.set.actualWeight;
      }
    });

    // Calculate average weight per exercise
    Object.values(exerciseStatsMap).forEach((stats) => {
      const sets = flatSets.filter((fs) => fs.exerciseId === stats.exerciseName);
      const totalWeight = sets.reduce((sum, fs) => sum + (fs.set.actualWeight || 0), 0);
      stats.avgWeight = sets.length > 0 ? totalWeight / sets.length : 0;
    });

    const perExerciseStats = Object.values(exerciseStatsMap);
    const totalVolume = perExerciseStats.reduce((sum, s) => sum + (s.volume || 0), 0);

    const log: WorkoutLogEntry = {
      id: `log-${Date.now()}`,
      workoutId: workout.id,
      workoutName: workout.name,
      performedAt: new Date().toISOString(),
      durationMinutes,
      unitSystem,
      totalVolume,
      totalSets: flatSets.length,
      totalExercises: workout.exercises.length,
      perExerciseStats,
    };

    setShowComplete(true);
    setTimeout(() => {
      onComplete(log);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentIndex + 1) / flatSets.length) * 100;

  if (!currentFlatSet) {
    return null;
  }

  const isTimeBased = !!currentFlatSet.set.targetTimeSeconds;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            {workout.name}
          </Typography>
          <IconButton
            onClick={onExit}
            size="small"
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'error.light',
                borderColor: 'error.main',
                color: 'white',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1, fontWeight: 600 }}>
          {currentIndex + 1} / {flatSets.length} sets
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: 'rgba(255,107,53,0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 2,
              bgcolor: 'primary.main',
            },
          }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3 }}>
        {/* Phase Tag */}
        {currentFlatSet.tag && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Chip
              label={currentFlatSet.tag.toUpperCase()}
              sx={{
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: 0.5,
                bgcolor: 'primary.main',
                color: 'white',
                px: 1.5,
                height: 28,
              }}
            />
          </Box>
        )}

        {/* Exercise Name */}
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            mb: 0.5,
            fontSize: { xs: '1.8rem', sm: '2.2rem' },
            lineHeight: 1.2,
          }}
        >
          {currentFlatSet.exerciseName}
        </Typography>

        {/* Set Info */}
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 4, fontWeight: 500 }}>
          Set {currentFlatSet.setIndex + 1}
        </Typography>

        {/* Timer or Reps Display */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {isTimeBased ? (
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3.5rem', sm: '4rem' },
                fontWeight: 700,
                color: 'primary.main',
                animation: isPlaying ? 'pulse 1s ease-in-out infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                  '50%': {
                    opacity: 0.9,
                    transform: 'scale(1.02)',
                  },
                },
              }}
            >
              {formatTime(timeRemaining)}
            </Typography>
          ) : (
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3.5rem', sm: '4rem' },
                  fontWeight: 700,
                  color: 'primary.main',
                }}
              >
                {currentFlatSet.set.targetReps || 0}
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                reps
              </Typography>
            </Box>
          )}
        </Box>

        {/* Adjustment Controls for Rep-Based */}
        {!isTimeBased && (
          <Box sx={{ mb: 4 }}>
            <Card sx={{ bgcolor: 'background.paper', mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Reps
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleAdjustReps(-1)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                      {currentFlatSet.set.actualReps || 0}
                    </Typography>
                    <IconButton size="small" onClick={() => handleAdjustReps(1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'})
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleAdjustWeight(-5)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ minWidth: 50, textAlign: 'center' }}>
                      {currentFlatSet.set.actualWeight || 0}
                    </Typography>
                    <IconButton size="small" onClick={() => handleAdjustWeight(5)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Play/Pause Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2.5, mb: 4 }}>
          <IconButton
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'background.paper',
              border: '2px solid',
              borderColor: currentIndex === 0 ? 'divider' : 'primary.main',
              color: currentIndex === 0 ? 'text.disabled' : 'primary.main',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: currentIndex === 0 ? 'background.paper' : 'rgba(255,107,53,0.08)',
                transform: currentIndex === 0 ? 'none' : 'scale(1.05)',
              },
            }}
          >
            <SkipPreviousIcon />
          </IconButton>

          <Box
            onClick={isTimeBased ? handlePlayPause : handleNext}
            sx={{
              width: { xs: 70, sm: 76 },
              height: { xs: 70, sm: 76 },
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.08)',
                boxShadow: '0 6px 24px rgba(255,107,53,0.4)',
              },
              '&:active': {
                transform: 'scale(1.02)',
              },
            }}
          >
            {isTimeBased && !isPlaying ? (
              <PlayArrowIcon sx={{ fontSize: { xs: 36, sm: 40 } }} />
            ) : isTimeBased && isPlaying ? (
              <PauseIcon sx={{ fontSize: { xs: 36, sm: 40 } }} />
            ) : (
              <CheckCircleIcon sx={{ fontSize: { xs: 36, sm: 40 } }} />
            )}
          </Box>

          <IconButton
            onClick={handleNext}
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'background.paper',
              border: '2px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(255,107,53,0.08)',
                transform: 'scale(1.05)',
              },
            }}
          >
            <SkipNextIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Next Up Preview */}
      <Box sx={{ p: 2.5, borderTop: 1, borderColor: 'divider', maxHeight: 160, overflow: 'auto' }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            mb: 1.5,
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: 0.5,
          }}
        >
          NEXT UP
        </Typography>
        {flatSets.slice(currentIndex + 1, currentIndex + 4).map((fs, idx) => (
          <Box
            key={`${fs.exerciseIndex}-${fs.setIndex}`}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1,
              px: 1.5,
              mb: 0.5,
              borderRadius: 1.5,
              bgcolor: idx === 0 ? 'rgba(255,107,53,0.08)' : 'transparent',
              border: idx === 0 ? '1px solid' : '1px solid transparent',
              borderColor: idx === 0 ? 'primary.main' : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: idx === 0 ? 'primary.main' : 'text.secondary',
                fontWeight: idx === 0 ? 600 : 400,
                fontSize: '0.8rem',
              }}
            >
              {currentIndex + idx + 2}. {fs.exerciseName} - Set {fs.setIndex + 1}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: idx === 0 ? 'primary.main' : 'text.secondary',
                fontWeight: idx === 0 ? 600 : 400,
                fontSize: '0.8rem',
              }}
            >
              {fs.set.targetTimeSeconds
                ? formatTime(fs.set.targetTimeSeconds)
                : `${fs.set.targetReps} reps`}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Completion Dialog */}
      <Dialog open={showComplete}>
        <DialogContent sx={{ textAlign: 'center', py: 6 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Workout Complete!
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Great job crushing that workout!
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
