'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import { UnitProvider, useUnits } from '@/contexts/UnitContext';
import CollapsibleCalculator from '@/components/CollapsibleCalculator';
import StyledNumberInput from '@/components/StyledNumberInput';

function CalculatorsContent() {
  const { units, setUnits } = useUnits();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          Fitness Calculators
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Simple, practical calculators to support your training decisions.
        </Typography>

        <Alert severity="warning" sx={{ mb: 4 }}>
          <strong>Disclaimer:</strong> These calculators provide estimates for educational purposes only.
          Results should not be considered medical advice. Always consult with a qualified healthcare
          professional before making decisions about your health or fitness.
        </Alert>

        {/* Global Unit Toggle */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Unit System:
          </Typography>
          <ToggleButtonGroup
            value={units}
            exclusive
            onChange={(_, newUnit) => newUnit && setUnits(newUnit)}
            sx={{
              '& .MuiToggleButton-root': {
                px: 3,
              },
            }}
          >
            <ToggleButton value="imperial">Imperial (lbs, inches)</ToggleButton>
            <ToggleButton value="metric">Metric (kg, cm)</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <CollapsibleCalculator
            id="bmi"
            title="BMI Calculator"
            subtitle="Calculate your Body Mass Index"
          >
            <BMICalculator />
          </CollapsibleCalculator>

          <CollapsibleCalculator
            id="tdee"
            title="TDEE / BMR Calculator"
            subtitle="Estimate your daily caloric needs"
          >
            <TDEECalculator />
          </CollapsibleCalculator>

          <CollapsibleCalculator
            id="onerm"
            title="One Rep Max (1RM) Calculator"
            subtitle="Estimate your maximum lift capacity"
          >
            <OneRMCalculator />
          </CollapsibleCalculator>

          <CollapsibleCalculator
            id="plates"
            title="Plate Loading Calculator"
            subtitle="Figure out which plates to load on your barbell"
          >
            <PlateCalculator />
          </CollapsibleCalculator>

          <CollapsibleCalculator
            id="rpe"
            title="RPE to Intensity Calculator"
            subtitle="Convert Rate of Perceived Exertion to training intensity"
          >
            <RPECalculator />
          </CollapsibleCalculator>
        </Box>

        <Box sx={{ mt: 4, p: 2, backgroundColor: 'rgba(255, 107, 53, 0.05)', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Tip:</strong> You can link directly to any calculator using URL anchors, e.g.,{' '}
            <code>/calculators#bmi</code> or <code>/calculators#tdee</code>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

function BMICalculator() {
  const { units } = useUnits();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState<number | null>(null);

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) {
      alert('Please enter valid values');
      return;
    }

    let bmiValue: number;
    if (units === 'metric') {
      // BMI = kg / (m^2)
      bmiValue = w / ((h / 100) ** 2);
    } else {
      // BMI = (lbs / (inches^2)) * 703
      bmiValue = (w / (h ** 2)) * 703;
    }

    setBMI(parseFloat(bmiValue.toFixed(1)));
  };

  const getCategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'info' };
    if (bmi < 25) return { text: 'Normal weight', color: 'success' };
    if (bmi < 30) return { text: 'Overweight', color: 'warning' };
    return { text: 'Obese', color: 'error' };
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <StyledNumberInput
            fullWidth
            label={units === 'metric' ? 'Height (cm)' : 'Height (inches)'}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            step={1}
            min={0}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledNumberInput
            fullWidth
            label={units === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step={units === 'metric' ? 0.5 : 1}
            min={0}
          />
        </Grid>
      </Grid>

      <Button variant="contained" onClick={calculate} sx={{ mt: 2 }}>
        Calculate BMI
      </Button>

      {bmi !== null && (
        <Alert severity={getCategory(bmi).color as any} sx={{ mt: 3 }}>
          <Typography variant="h6">BMI: {bmi}</Typography>
          <Typography>Category: {getCategory(bmi).text}</Typography>
        </Alert>
      )}
    </Box>
  );
}

function TDEECalculator() {
  const { units } = useUnits();
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('sedentary');
  const [result, setResult] = useState<{ bmr: number; tdee: number } | null>(null);

  const activityMultipliers = {
    sedentary: { label: 'Sedentary (little to no exercise)', value: 1.2 },
    light: { label: 'Lightly active (1-3 days/week)', value: 1.375 },
    moderate: { label: 'Moderately active (3-5 days/week)', value: 1.55 },
    very: { label: 'Very active (6-7 days/week)', value: 1.725 },
    extreme: { label: 'Extremely active (physical job + training)', value: 1.9 },
  };

  const calculate = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!a || !h || !w || a <= 0 || h <= 0 || w <= 0) {
      alert('Please enter valid values');
      return;
    }

    // Mifflin-St Jeor Equation
    let bmr: number;
    let weightKg = units === 'metric' ? w : w * 0.453592;
    let heightCm = units === 'metric' ? h : h * 2.54;

    if (sex === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * a + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * a - 161;
    }

    const tdee = bmr * activityMultipliers[activity as keyof typeof activityMultipliers].value;

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
    });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <StyledNumberInput
            fullWidth
            label="Age (years)"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            step={1}
            min={1}
            max={120}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Sex</InputLabel>
            <Select value={sex} label="Sex" onChange={(e) => setSex(e.target.value)}>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledNumberInput
            fullWidth
            label={units === 'metric' ? 'Height (cm)' : 'Height (inches)'}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            step={1}
            min={0}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledNumberInput
            fullWidth
            label={units === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step={units === 'metric' ? 0.5 : 1}
            min={0}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Activity Level</InputLabel>
            <Select value={activity} label="Activity Level" onChange={(e) => setActivity(e.target.value)}>
              {Object.entries(activityMultipliers).map(([key, { label }]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Button variant="contained" onClick={calculate} sx={{ mt: 2 }}>
        Calculate TDEE
      </Button>

      {result && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="h6">BMR: {result.bmr} calories/day</Typography>
          <Typography variant="h6">TDEE: {result.tdee} calories/day</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            BMR = calories burned at rest | TDEE = total daily calorie burn
          </Typography>
        </Alert>
      )}
    </Box>
  );
}

function OneRMCalculator() {
  const { units } = useUnits();
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [oneRM, setOneRM] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);

    if (!w || !r || w <= 0 || r <= 0 || r > 12) {
      alert('Please enter valid values (reps should be between 1-12)');
      return;
    }

    // Epley formula: 1RM = weight × (1 + reps/30)
    const estimated1RM = w * (1 + r / 30);
    setOneRM(Math.round(estimated1RM * 10) / 10);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <StyledNumberInput
            fullWidth
            label={units === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step={units === 'metric' ? 2.5 : 5}
            min={0}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledNumberInput
            fullWidth
            label="Reps performed"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            step={1}
            min={1}
            max={12}
            helperText="Works best with 1-12 reps"
          />
        </Grid>
      </Grid>

      <Button variant="contained" onClick={calculate} sx={{ mt: 2 }}>
        Calculate 1RM
      </Button>

      {oneRM !== null && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="h6">
            Estimated 1RM: {oneRM} {units === 'metric' ? 'kg' : 'lbs'}
          </Typography>
          <Typography variant="body2">
            This is an estimate based on the Epley formula. Actual 1RM may vary.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}

function PlateCalculator() {
  const { units } = useUnits();
  const [targetWeight, setTargetWeight] = useState('');
  const [barWeight, setBarWeight] = useState(units === 'metric' ? '20' : '45');
  const [result, setResult] = useState<string | null>(null);

  // Update bar weight default when units change
  useState(() => {
    setBarWeight(units === 'metric' ? '20' : '45');
  });

  const availablePlatesImperial = [45, 35, 25, 15, 10, 5, 2.5];
  const availablePlatesMetric = [25, 20, 15, 10, 5, 2.5, 1.25];

  const calculate = () => {
    const target = parseFloat(targetWeight);
    const bar = parseFloat(barWeight);
    const availablePlates = units === 'metric' ? availablePlatesMetric : availablePlatesImperial;

    if (!target || !bar || target <= bar) {
      alert('Please enter valid values (target weight must be greater than bar weight)');
      return;
    }

    const weightPerSide = (target - bar) / 2;
    let remaining = weightPerSide;
    const plates: number[] = [];

    for (const plate of availablePlates) {
      while (remaining >= plate) {
        plates.push(plate);
        remaining -= plate;
      }
    }

    const unitLabel = units === 'metric' ? 'kg' : 'lbs';

    if (remaining > 0.1) {
      setResult(
        `Cannot load exactly ${target} ${unitLabel}. Closest: ${
          bar + plates.reduce((a, b) => a + b, 0) * 2
        } ${unitLabel}`
      );
    } else {
      setResult(
        `Per side: ${plates.map((p) => `${p} ${unitLabel}`).join(', ') || 'No plates needed'}`
      );
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <StyledNumberInput
            fullWidth
            label={`Target weight (${units === 'metric' ? 'kg' : 'lbs'})`}
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            step={units === 'metric' ? 2.5 : 5}
            min={0}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledNumberInput
            fullWidth
            label={`Bar weight (${units === 'metric' ? 'kg' : 'lbs'})`}
            value={barWeight}
            onChange={(e) => setBarWeight(e.target.value)}
            step={units === 'metric' ? 2.5 : 5}
            min={0}
          />
        </Grid>
      </Grid>

      <Button variant="contained" onClick={calculate} sx={{ mt: 2 }}>
        Calculate Plates
      </Button>

      {result && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body1">{result}</Typography>
          <Typography variant="caption">
            Available plates:{' '}
            {(units === 'metric' ? availablePlatesMetric : availablePlatesImperial).join(', ')}{' '}
            {units === 'metric' ? 'kg' : 'lbs'}
          </Typography>
        </Alert>
      )}
    </Box>
  );
}

function RPECalculator() {
  const [rpe, setRPE] = useState('');
  const [reps, setReps] = useState('');
  const [intensity, setIntensity] = useState<number | null>(null);

  const calculate = () => {
    const rpeValue = parseFloat(rpe);
    const repsValue = parseInt(reps);

    if (!rpeValue || !repsValue || rpeValue < 6 || rpeValue > 10 || repsValue < 1 || repsValue > 12) {
      alert('Please enter valid values (RPE: 6-10, Reps: 1-12)');
      return;
    }

    // Simple RPE to percentage approximation
    const repsInReserve = 10 - rpeValue;
    const estimatedIntensity = 100 - (repsValue + repsInReserve) * 2.5;

    setIntensity(Math.max(50, Math.min(100, Math.round(estimatedIntensity))));
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        RPE (Rate of Perceived Exertion): 10 = max effort, 9 = 1 rep in reserve, 8 = 2 reps in reserve, etc.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <StyledNumberInput
            fullWidth
            label="RPE (6-10)"
            value={rpe}
            onChange={(e) => setRPE(e.target.value)}
            step={0.5}
            min={6}
            max={10}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledNumberInput
            fullWidth
            label="Reps performed"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            step={1}
            min={1}
            max={12}
          />
        </Grid>
      </Grid>

      <Button variant="contained" onClick={calculate} sx={{ mt: 2 }}>
        Calculate Intensity
      </Button>

      {intensity !== null && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="h6">Estimated Intensity: ~{intensity}% of 1RM</Typography>
          <Typography variant="body2">This is a rough approximation for programming purposes.</Typography>
        </Alert>
      )}
    </Box>
  );
}

export default function Calculators() {
  return (
    <UnitProvider>
      <CalculatorsContent />
    </UnitProvider>
  );
}
