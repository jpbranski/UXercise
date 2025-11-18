'use client';

import { TextField, InputAdornment, IconButton, Box, TextFieldProps } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface StyledNumberInputProps extends Omit<TextFieldProps, 'type'> {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: number;
  min?: number;
  max?: number;
}

export default function StyledNumberInput({
  value,
  onChange,
  step = 1,
  min,
  max,
  ...textFieldProps
}: StyledNumberInputProps) {
  const handleIncrement = () => {
    const currentValue = parseFloat(String(value)) || 0;
    const newValue = currentValue + step;
    if (max === undefined || newValue <= max) {
      onChange({
        target: { value: String(newValue) },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleDecrement = () => {
    const currentValue = parseFloat(String(value)) || 0;
    const newValue = currentValue - step;
    if (min === undefined || newValue >= min) {
      onChange({
        target: { value: String(newValue) },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <TextField
      {...textFieldProps}
      value={value}
      onChange={onChange}
      type="number"
      InputProps={{
        ...textFieldProps.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, mr: -1 }}>
              <IconButton
                size="small"
                onClick={handleIncrement}
                disabled={max !== undefined && parseFloat(String(value)) >= max}
                sx={{
                  padding: '2px',
                  borderRadius: 0,
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 53, 0.08)',
                  },
                }}
              >
                <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleDecrement}
                disabled={min !== undefined && parseFloat(String(value)) <= min}
                sx={{
                  padding: '2px',
                  borderRadius: 0,
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 53, 0.08)',
                  },
                }}
              >
                <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </InputAdornment>
        ),
      }}
      sx={{
        ...textFieldProps.sx,
        '& input[type=number]': {
          MozAppearance: 'textfield',
        },
        '& input[type=number]::-webkit-outer-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
        '& input[type=number]::-webkit-inner-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
      }}
    />
  );
}
