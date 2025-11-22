'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { WorkoutLogEntry } from '@/lib/demo/types';

interface LogViewProps {
  logs: WorkoutLogEntry[];
}

export default function LogView({ logs }: LogViewProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchText, setSearchText] = useState('');

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.performedAt);

    // Date filters
    if (startDate) {
      const start = new Date(startDate);
      if (logDate < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (logDate > end) return false;
    }

    // Search filter
    if (searchText && !log.workoutName.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Sort by date descending
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
  );

  // Export Summary CSV
  const handleExportSummary = () => {
    const headers = ['Date', 'Workout', 'Duration (min)', 'Total Volume', 'Total Sets', 'Total Exercises'];
    const rows = sortedLogs.map((log) => [
      new Date(log.performedAt).toLocaleDateString(),
      log.workoutName,
      log.durationMinutes,
      log.totalVolume || 0,
      log.totalSets,
      log.totalExercises,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    downloadCSV(csv, 'workout-summary.csv');
  };

  // Export Full Details CSV
  const handleExportDetails = () => {
    const headers = [
      'Date',
      'Workout',
      'Exercise',
      'Sets Completed',
      'Reps Completed',
      'Avg Weight',
      'Volume',
    ];
    const rows: any[] = [];

    sortedLogs.forEach((log) => {
      log.perExerciseStats.forEach((stat) => {
        rows.push([
          new Date(log.performedAt).toLocaleDateString(),
          log.workoutName,
          stat.exerciseName,
          stat.setsCompleted,
          stat.repsCompleted || 0,
          stat.avgWeight || 0,
          stat.volume || 0,
        ]);
      });
    });

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    downloadCSV(csv, 'workout-details.csv');
  };

  // Helper to download CSV
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Workout Log
      </Typography>

      {/* Filters */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Filters
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ minWidth: 150 }}
            />
            <TextField
              label="Search"
              placeholder="Search workout name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="small"
              sx={{ flex: 1, minWidth: 200 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportSummary}
              disabled={sortedLogs.length === 0}
            >
              Export Summary CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportDetails}
              disabled={sortedLogs.length === 0}
            >
              Export Full Details CSV
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Results */}
      {sortedLogs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            No workout logs found
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {startDate || endDate || searchText
              ? 'Try adjusting your filters'
              : 'Complete a workout to see it here'}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {sortedLogs.length} workout{sortedLogs.length !== 1 ? 's' : ''} found
          </Typography>

          {sortedLogs.map((log) => {
            const date = new Date(log.performedAt);
            const formattedDate = date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const formattedTime = date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            });

            return (
              <Accordion
                key={log.id}
                elevation={0}
                sx={{
                  mb: 1.5,
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:before': { display: 'none' },
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ px: 2.5, py: 1 }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {log.workoutName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {formattedDate} at {formattedTime}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={`${log.durationMinutes} min`} size="small" />
                      <Chip label={`${log.totalSets} sets`} size="small" variant="outlined" />
                      {log.totalVolume && log.totalVolume > 0 && (
                        <Chip label={`${log.totalVolume.toLocaleString()} vol`} size="small" variant="outlined" />
                      )}
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Exercise Breakdown
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Exercise</TableCell>
                          <TableCell align="right">Sets</TableCell>
                          <TableCell align="right">Reps</TableCell>
                          <TableCell align="right">Avg Weight</TableCell>
                          <TableCell align="right">Volume</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {log.perExerciseStats.map((stat, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{stat.exerciseName}</TableCell>
                            <TableCell align="right">{stat.setsCompleted}</TableCell>
                            <TableCell align="right">{stat.repsCompleted || '-'}</TableCell>
                            <TableCell align="right">
                              {stat.avgWeight ? `${stat.avgWeight.toFixed(1)} ${log.unitSystem === 'imperial' ? 'lbs' : 'kg'}` : '-'}
                            </TableCell>
                            <TableCell align="right">{stat.volume ? stat.volume.toLocaleString() : '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
