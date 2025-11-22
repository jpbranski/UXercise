'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { UserProfile } from '@/lib/demo/types';
import { getDefaultProfile } from '@/lib/demo/storage';

interface AccountPanelProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export default function AccountPanel({ profile, onSave }: AccountPanelProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('imperial');
  const [heightCm, setHeightCm] = useState<number | ''>('');
  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email || '');
    setUnitSystem(profile.unitSystem);
    setHeightCm(profile.heightCm || '');
    setWeightKg(profile.weightKg || '');
    setAvatarDataUrl(profile.avatarDataUrl);
  }, [profile]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }

    // Convert to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    const updatedProfile: UserProfile = {
      name: name.trim(),
      email: email.trim() || undefined,
      unitSystem,
      heightCm: typeof heightCm === 'number' ? heightCm : undefined,
      weightKg: typeof weightKg === 'number' ? weightKg : undefined,
      avatarDataUrl,
      createdAt: profile.createdAt,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedProfile);
  };

  const handleReset = () => {
    if (confirm('Reset profile to defaults?')) {
      const defaultProfile = getDefaultProfile();
      setName(defaultProfile.name);
      setEmail('');
      setUnitSystem(defaultProfile.unitSystem);
      setHeightCm('');
      setWeightKg('');
      setAvatarDataUrl(undefined);
    }
  };

  // Convert units for display
  const heightInches = typeof heightCm === 'number' ? Math.round(heightCm / 2.54) : '';
  const heightFeet = typeof heightInches === 'number' ? Math.floor(heightInches / 12) : '';
  const heightRemainingInches = typeof heightInches === 'number' ? heightInches % 12 : '';
  const weightLbs = typeof weightKg === 'number' ? Math.round(weightKg * 2.205) : '';

  const handleHeightChange = (value: string, unit: 'cm' | 'feet' | 'inches') => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      setHeightCm('');
      return;
    }

    if (unit === 'cm') {
      setHeightCm(num);
    } else if (unit === 'feet') {
      const totalInches = num * 12 + (typeof heightRemainingInches === 'number' ? heightRemainingInches : 0);
      setHeightCm(Math.round(totalInches * 2.54));
    } else if (unit === 'inches') {
      const feet = typeof heightFeet === 'number' ? heightFeet : 0;
      const totalInches = feet * 12 + num;
      setHeightCm(Math.round(totalInches * 2.54));
    }
  };

  const handleWeightChange = (value: string, unit: 'kg' | 'lbs') => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      setWeightKg('');
      return;
    }

    if (unit === 'kg') {
      setWeightKg(num);
    } else {
      setWeightKg(Math.round((num / 2.205) * 10) / 10);
    }
  };

  // Calculate BMI if we have both height and weight
  const bmi =
    typeof heightCm === 'number' && typeof weightKg === 'number' && heightCm > 0
      ? (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1)
      : null;

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Account
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* Avatar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={avatarDataUrl}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              {!avatarDataUrl && getInitials(name || 'User')}
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<PhotoCameraIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Photo
            </Button>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
              Max 2MB
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Name */}
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Email */}
          <TextField
            fullWidth
            label="Email (optional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Unit System */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
              Unit System
            </Typography>
            <ToggleButtonGroup
              value={unitSystem}
              exclusive
              onChange={(_, newUnit) => newUnit && setUnitSystem(newUnit)}
              fullWidth
            >
              <ToggleButton value="imperial">Imperial (lbs, ft/in)</ToggleButton>
              <ToggleButton value="metric">Metric (kg, cm)</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Height */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
              Height
            </Typography>
            {unitSystem === 'metric' ? (
              <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                value={heightCm}
                onChange={(e) => handleHeightChange(e.target.value, 'cm')}
              />
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Feet"
                  type="number"
                  value={heightFeet}
                  onChange={(e) => handleHeightChange(e.target.value, 'feet')}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Inches"
                  type="number"
                  value={heightRemainingInches}
                  onChange={(e) => handleHeightChange(e.target.value, 'inches')}
                  sx={{ flex: 1 }}
                />
              </Box>
            )}
          </Box>

          {/* Weight */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
              Weight
            </Typography>
            <TextField
              fullWidth
              label={unitSystem === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
              type="number"
              value={unitSystem === 'metric' ? weightKg : weightLbs}
              onChange={(e) => handleWeightChange(e.target.value, unitSystem === 'metric' ? 'kg' : 'lbs')}
            />
          </Box>

          {/* BMI */}
          {bmi && (
            <Card variant="outlined" sx={{ bgcolor: 'background.default', p: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Body Mass Index (BMI)
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                {bmi}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {getBMICategory(parseFloat(bmi))}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                BMI is a rough estimate and doesn't account for muscle mass
              </Typography>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} fullWidth>
          Save Profile
        </Button>
        <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </Box>
  );
}
