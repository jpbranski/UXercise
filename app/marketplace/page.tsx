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
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VerifiedIcon from '@mui/icons-material/Verified';
import marketplaceData from '@/data/marketplace.json';

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAffiliateOnly, setShowAffiliateOnly] = useState(false);

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

      const matchesAffiliate = !showAffiliateOnly || product.affiliate;

      return matchesSearch && matchesCategory && matchesAffiliate;
    });
  }, [searchTerm, selectedCategory, showAffiliateOnly]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setShowAffiliateOnly(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          Fitness Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Curated selection of training equipment and fitness products. Affiliate links are clearly marked.
        </Typography>

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
                    checked={showAffiliateOnly}
                    onChange={(e) => setShowAffiliateOnly(e.target.checked)}
                    color="secondary"
                  />
                }
                label="Affiliate only"
              />
            </Grid>
          </Grid>
          {(searchTerm || selectedCategory !== 'All' || showAffiliateOnly) && (
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
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'contain', backgroundColor: 'background.default', p: 2 }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ flexGrow: 1, fontSize: '1.1rem' }}>
                      {product.name}
                    </Typography>
                    {product.affiliate && (
                      <Chip
                        label="Affiliate"
                        size="small"
                        color="secondary"
                        icon={<VerifiedIcon />}
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {product.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip label={product.category} size="small" sx={{ mr: 1, mb: 1 }} />
                    {product.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>

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
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    View Product <OpenInNewIcon sx={{ ml: 0.5, fontSize: 16 }} />
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
