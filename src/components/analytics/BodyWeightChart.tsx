/**
 * Body Weight Chart Component
 * Displays body weight over time using Recharts
 */

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';

type BodyWeightEntry = {
  date: Date | string;
  weight: number;
};

interface BodyWeightChartProps {
  data: BodyWeightEntry[];
}

export function BodyWeightChart({ data }: BodyWeightChartProps) {
  const theme = useTheme();

  const chartData = data.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: entry.weight,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey="date" stroke={theme.palette.text.secondary} style={{ fontSize: '12px' }} />
        <YAxis
          stroke={theme.palette.text.secondary}
          style={{ fontSize: '12px' }}
          domain={['dataMin - 2', 'dataMax + 2']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
          }}
          labelStyle={{ color: theme.palette.text.primary }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          dot={{ fill: theme.palette.primary.main, r: 4 }}
          activeDot={{ r: 6 }}
          name="Weight (kg)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
