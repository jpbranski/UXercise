'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
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

export default function Calculators() {
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

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <BMICalculator />
          </Grid>
          <Grid item xs={12}>
            <TDEECalculator />
          </Grid>
          <Grid item xs={12}>
            <OneRMCalculator />
          </Grid>
          <Grid item xs={12}>
            <PlateCalculator />
          </Grid>
          <Grid item xs={12}>
            <RPECalculator />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('imperial');
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
    if (unit === 'metric') {
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
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          1. BMI Calculator
        </Typography>

        <ToggleButtonGroup
          value={unit}
          exclusive
          onChange={(_, newUnit) => newUnit && setUnit(newUnit)}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="imperial">Imperial</ToggleButton>
          <ToggleButton value="metric">Metric</ToggleButton>
        </ToggleButtonGroup>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={unit === 'metric' ? 'Height (cm)' : 'Height (inches)'}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              type="number"
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
      </CardContent>
    </Card>
  );
}

function TDEECalculator() {
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

    // Mifflin-St Jeor Equation (using imperial units)
    let bmr: number;
    if (sex === 'male') {
      bmr = 10 * (w * 0.453592) + 6.25 * (h * 2.54) - 5 * a + 5;
    } else {
      bmr = 10 * (w * 0.453592) + 6.25 * (h * 2.54) - 5 * a - 161;
    }

    const tdee = bmr * activityMultipliers[activity as keyof typeof activityMultipliers].value;

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          2. TDEE / BMR Calculator
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age (years)"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
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
            <TextField
              fullWidth
              label="Height (inches)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Weight (lbs)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              type="number"
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
      </CardContent>
    </Card>
  );
}

function OneRMCalculator() {
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
    setOneRM(Math.round(estimated1RM));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          3. One Rep Max (1RM) Calculator
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Weight (lbs)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Reps performed"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              type="number"
              helperText="Works best with 1-12 reps"
            />
          </Grid>
        </Grid>

        <Button variant="contained" onClick={calculate} sx={{ mt: 2 }}>
          Calculate 1RM
        </Button>

        {oneRM !== null && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="h6">Estimated 1RM: {oneRM} lbs</Typography>
            <Typography variant="body2">
              This is an estimate based on the Epley formula. Actual 1RM may vary.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function PlateCalculator() {
  const [targetWeight, setTargetWeight] = useState('');
  const [barWeight, setBarWeight] = useState('45');
  const [result, setResult] = useState<string | null>(null);

  const availablePlates = [45, 35, 25, 15, 10, 5, 2.5];

  const calculate = () => {
    const target = parseFloat(targetWeight);
    const bar = parseFloat(barWeight);

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

    if (remaining > 0.1) {
      setResult(`Cannot load exactly ${target} lbs. Closest: ${bar + plates.reduce((a, b) => a + b, 0) * 2} lbs`);
    } else {
      setResult(`Per side: ${plates.map((p) => `${p} lb`).join(', ') || 'No plates needed'}`);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          4. Plate Loading Calculator
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Target weight (lbs)"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bar weight (lbs)"
              value={barWeight}
              onChange={(e) => setBarWeight(e.target.value)}
              type="number"
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
              Available plates: 45, 35, 25, 15, 10, 5, 2.5 lbs
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
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
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          5. RPE to Intensity Calculator
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          RPE (Rate of Perceived Exertion): 10 = max effort, 9 = 1 rep in reserve, 8 = 2 reps in reserve, etc.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="RPE (6-10)"
              value={rpe}
              onChange={(e) => setRPE(e.target.value)}
              type="number"
              inputProps={{ min: 6, max: 10, step: 0.5 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Reps performed"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              type="number"
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
      </CardContent>
    </Card>
  );
}
