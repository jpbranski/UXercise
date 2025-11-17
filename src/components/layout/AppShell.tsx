/**
 * AppShell - Main layout component for authenticated pages
 * Includes app bar with navigation and user menu
 */

'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';
import type { Session } from 'next-auth';

interface AppShellProps {
  children: React.ReactNode;
  session: Session;
}

const navigationLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { label: 'Programs', href: '/programs', icon: CalendarTodayIcon },
  { label: 'Workouts', href: '/workouts', icon: FitnessCenterIcon },
  { label: 'Analytics', href: '/analytics', icon: BarChartIcon },
  { label: 'Exercises', href: '/exercises', icon: FolderIcon },
];

const coachLinks = [{ label: 'Clients', href: '/coach', icon: GroupIcon }];

export function AppShell({ children, session }: AppShellProps) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isCoachOrAdmin = session.user.role === 'COACH' || session.user.role === 'ADMIN';
  const navLinks = isCoachOrAdmin ? [...navigationLinks, ...coachLinks] : navigationLinks;

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main', fontWeight: 700 }}>
        UXercise
      </Typography>
      <List>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <ListItem key={link.href} disablePadding>
              <ListItemButton
                component={Link}
                href={link.href}
                selected={pathname === link.href}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(226, 88, 34, 0.12)',
                    '&:hover': {
                      backgroundColor: 'rgba(226, 88, 34, 0.16)',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <Icon sx={{ color: pathname === link.href ? 'primary.main' : 'text.secondary' }} />
                </ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu Icon */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open navigation drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <FitnessCenterIcon sx={{ display: 'flex', mr: 1 }} aria-hidden="true" />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/dashboard"
              sx={{
                mr: 2,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              UXercise
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    component={Link}
                    href={link.href}
                    sx={{
                      my: 2,
                      color: pathname === link.href ? 'primary.main' : 'text.primary',
                      display: 'block',
                      fontWeight: pathname === link.href ? 600 : 400,
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}

            {isMobile && <Box sx={{ flexGrow: 1 }} />}

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} aria-label="User menu">
                  <Avatar alt={session.user.name || 'User'} src={session.user.image || undefined}>
                    {session.user.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem disabled>
                  <Typography textAlign="center">{session.user.email}</Typography>
                </MenuItem>
                <MenuItem component={Link} href="/settings" onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Settings</Typography>
                </MenuItem>
                <MenuItem component="a" href="/api/auth/signout" onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', pt: 3, pb: 6 }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
}
