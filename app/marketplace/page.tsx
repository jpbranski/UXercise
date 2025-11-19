'use client';

import { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Link as MuiLink,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  FormControlLabel,
  Switch,
  CardActionArea,
  Alert,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VerifiedIcon from '@mui/icons-material/Verified';
import marketplaceDataRaw from '@/data/marketplace.json';
import { MarketplaceItem } from '@/types/marketplace';

// Type-cast the imported data to ensure TypeScript knows the correct type
const marketplaceData = marketplaceDataRaw as MarketplaceItem[];

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hideAffiliate, setHideAffiliate] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(marketplaceData.map((p) => p.category));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return marketplaceData.filter((product) => {
      const matchesSearch =
        searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      const matchesAffiliate = !hideAffiliate || !product.affiliate;

      return matchesSearch && matchesCategory && matchesAffiliate;
    });
  }, [searchTerm, selectedCategory, hideAffiliate]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setHideAffiliate(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          Fitness Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Curated selection of training equipment and fitness products. Affiliate links are clearly marked.
        </Typography>

        {/* Amazon Affiliate Disclaimer */}
        <Alert severity="info" sx={{ mb: 4 }}>
          As an Amazon Associate, we earn from qualifying purchases. This means if you click on
          certain links and make a purchase, we may receive a small commission at no extra cost to
          you. We only recommend products we believe will provide value to our community.
        </Alert>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={hideAffiliate}
                    onChange={(e) => setHideAffiliate(e.target.checked)}
                    color="secondary"
                  />
                }
                label="Hide affiliate"
              />
            </Grid>
          </Grid>
          {(searchTerm || selectedCategory !== 'All' || hideAffiliate) && (
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" size="small" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Showing {filteredProducts.length} of {marketplaceData.length} products
              </Typography>
            </Box>
          )}
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {filteredProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 24px rgba(255, 107, 53, 0.25), 0 4px 12px rgba(157, 78, 221, 0.15)',
                    '& .product-image': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                {/* Affiliate Badge - Top Right */}
                {product.affiliate && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 1,
                    }}
                  >
                    <Chip
                      label="Affiliate"
                      size="small"
                      sx={{
                        backgroundColor: 'secondary.main',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                      }}
                    />
                  </Box>
                )}

                {/* Image Area */}
                <Box
                  sx={{
                    height: 200,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 107, 53, 0.05)',
                    position: 'relative',
                  }}
                >
                  <CardMedia
                    component="img"
                    className="product-image"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      p: 2,
                      transition: 'transform 0.3s ease-in-out',
                    }}
                    image={product.image}
                    alt={product.name}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      mb: 1,
                      lineHeight: 1.3,
                      minHeight: '2.6rem',
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      flexGrow: 1,
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {product.description}
                  </Typography>

                  {/* Tags */}
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        height: 22,
                      }}
                    />
                    {product.tags.slice(0, 2).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: 'divider',
                          fontSize: '0.7rem',
                          height: 22,
                        }}
                      />
                    ))}
                  </Box>

                  {/* CTA */}
                  <MuiLink
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      transition: 'all 0.2s',
                      '&:hover': {
                        color: 'primary.light',
                        gap: 0.75,
                      },
                      gap: 0.5,
                    }}
                  >
                    View product <OpenInNewIcon sx={{ fontSize: 16 }} />
                  </MuiLink>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No products found matching your filters.
            </Typography>
            <Button variant="outlined" onClick={clearFilters} sx={{ mt: 2 }}>
              Clear Filters
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
