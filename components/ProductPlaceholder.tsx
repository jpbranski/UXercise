import { Box, SvgIcon } from '@mui/material';

interface ProductPlaceholderProps {
  type: string;
  width?: number;
  height?: number;
}

export default function ProductPlaceholder({ type, width = 200, height = 200 }: ProductPlaceholderProps) {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case 'dumbbells':
      case 'adjustable dumbbells':
      case 'adjustable dumbbells set':
        return (
          <svg width={width} height={height} viewBox="0 0 200 200" fill="none">
            <rect x="40" y="85" width="20" height="30" rx="2" fill="url(#gradient1)" />
            <rect x="140" y="85" width="20" height="30" rx="2" fill="url(#gradient1)" />
            <rect x="60" y="95" width="80" height="10" rx="2" fill="#B0B0B0" />
            <circle cx="50" cy="100" r="15" fill="url(#gradient2)" />
            <circle cx="150" cy="100" r="15" fill="url(#gradient2)" />
            <text x="100" y="175" textAnchor="middle" fill="#9D4EDD" fontSize="14" fontWeight="600">
              Dumbbells
            </text>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#FF8C61" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9D4EDD" />
                <stop offset="100%" stopColor="#B576E8" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'barbell':
      case 'olympic barbell':
      case 'olympic barbell (45 lb)':
      case 'ez curl bar':
        return (
          <svg width={width} height={height} viewBox="0 0 200 200" fill="none">
            <rect x="30" y="95" width="140" height="10" rx="2" fill="#B0B0B0" />
            <rect x="25" y="85" width="15" height="30" rx="2" fill="url(#gradient1)" />
            <rect x="160" y="85" width="15" height="30" rx="2" fill="url(#gradient1)" />
            <circle cx="32" cy="100" r="8" fill="url(#gradient2)" />
            <circle cx="168" cy="100" r="8" fill="url(#gradient2)" />
            <text x="100" y="175" textAnchor="middle" fill="#9D4EDD" fontSize="14" fontWeight="600">
              Barbell
            </text>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#FF8C61" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9D4EDD" />
                <stop offset="100%" stopColor="#B576E8" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'bench':
      case 'flat weight bench':
      case 'power rack':
      case 'power rack with pull-up bar':
      case 'plyo box':
      case 'plyo box (20/24/30 inch)':
      case 'dip station':
        return (
          <svg width={width} height={height} viewBox="0 0 200 200" fill="none">
            <rect x="40" y="90" width="120" height="50" rx="4" fill="url(#gradient1)" />
            <rect x="45" y="140" width="10" height="30" fill="#B0B0B0" />
            <rect x="145" y="140" width="10" height="30" fill="#B0B0B0" />
            <text x="100" y="60" textAnchor="middle" fill="#9D4EDD" fontSize="14" fontWeight="600">
              Equipment
            </text>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#FF8C61" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'bands':
      case 'resistance bands':
      case 'resistance bands set':
      case 'pull-up assistance bands':
        return (
          <svg width={width} height={height} viewBox="0 0 200 200" fill="none">
            <ellipse cx="100" cy="100" rx="40" ry="60" fill="none" stroke="url(#gradient1)" strokeWidth="8" />
            <ellipse cx="100" cy="100" rx="30" ry="50" fill="none" stroke="url(#gradient2)" strokeWidth="6" />
            <text x="100" y="180" textAnchor="middle" fill="#9D4EDD" fontSize="14" fontWeight="600">
              Bands
            </text>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#FF8C61" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9D4EDD" />
                <stop offset="100%" stopColor="#B576E8" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'kettlebell':
      case 'kettlebell set':
      case 'kettlebell set (20, 35, 50 lb)':
        return (
          <svg width={width} height={height} viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="120" r="40" fill="url(#gradient1)" />
            <rect x="85" y="60" width="30" height="50" rx="15" fill="none" stroke="url(#gradient2)" strokeWidth="8" />
            <text x="100" y="180" textAnchor="middle" fill="#9D4EDD" fontSize="14" fontWeight="600">
              Kettlebell
            </text>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#FF8C61" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9D4EDD" />
                <stop offset="100%" stopColor="#B576E8" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'plates':
      case 'bumper plates':
      case 'bumper plates set':
        return (
          <svg width={width} height={height} viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="50" fill="url(#gradient1)" />
            <circle cx="100" cy="100" r="15" fill="#121212" />
            <text x="100" y="175" textAnchor="middle" fill="#9D4EDD" fontSize="14" fontWeight="600">
              Plates
            </text>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#FF8C61" />
              </linearGradient>
            </defs>
          </svg>
        );

      default:
        return (
          <svg width={width} height={height} viewBox="0 0 200 200" fill="none">
            <rect x="50" y="70" width="100" height="60" rx="4" fill="url(#gradient1)" />
            <circle cx="100" cy="100" r="20" fill="url(#gradient2)" />
            <text x="100" y="175" textAnchor="middle" fill="#9D4EDD" fontSize="14" fontWeight="600">
              Equipment
            </text>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" />
                <stop offset="100%" stopColor="#FF8C61" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9D4EDD" />
                <stop offset="100%" stopColor="#B576E8" />
              </linearGradient>
            </defs>
          </svg>
        );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 107, 53, 0.05)',
      }}
    >
      {getIcon()}
    </Box>
  );
}
