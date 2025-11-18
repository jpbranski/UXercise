'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Box, Typography, Card, CardContent, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface CollapsibleCalculatorProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export default function CollapsibleCalculator({
  id,
  title,
  subtitle,
  children,
  defaultExpanded = false,
}: CollapsibleCalculatorProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Handle hash-based deep linking
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash === id) {
        setExpanded(true);
        // Scroll to element after a small delay to ensure it's expanded
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };

    // Check on mount
    checkHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [id]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      id={id}
      sx={{
        border: expanded ? '1px solid rgba(255, 107, 53, 0.3)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        onClick={handleToggle}
        sx={{
          p: 2,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: expanded ? 'rgba(255, 107, 53, 0.05)' : 'transparent',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 107, 53, 0.08)',
          },
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: expanded ? 'primary.main' : 'text.primary' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            color: expanded ? 'primary.main' : 'text.secondary',
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>
      <Collapse in={expanded} timeout="auto">
        <CardContent sx={{ pt: 0 }}>{children}</CardContent>
      </Collapse>
    </Card>
  );
}
