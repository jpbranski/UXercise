'use client';

import { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
  Chip,
  Grid,
  Link as MuiLink,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VerifiedIcon from '@mui/icons-material/Verified';
import resourcesData from '@/data/resources.json';

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');

  // Get unique categories and tags
  const categories = useMemo(() => {
    const cats = new Set(resourcesData.map((r) => r.category));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set(resourcesData.flatMap((r) => r.tags));
    return ['All', ...Array.from(tags).sort()];
  }, []);

  // Filter resources
  const filteredResources = useMemo(() => {
    return resourcesData.filter((resource) => {
      const matchesSearch =
        searchTerm === '' ||
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || resource.category === selectedCategory;

      const matchesTag =
        selectedTag === 'All' || resource.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [searchTerm, selectedCategory, selectedTag]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedTag('All');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          Fitness Resources
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Curated collection of training programs, educational content, and useful tools
          from around the web.
        </Typography>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search resources"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or description..."
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
              <FormControl fullWidth>
                <InputLabel>Tag</InputLabel>
                <Select
                  value={selectedTag}
                  label="Tag"
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  {allTags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {(searchTerm || selectedCategory !== 'All' || selectedTag !== 'All') && (
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" size="small" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Showing {filteredResources.length} of {resourcesData.length} resources
              </Typography>
            </Box>
          )}
        </Box>

        {/* Resources Grid */}
        <Grid container spacing={3}>
          {filteredResources.map((resource, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                      {resource.title}
                    </Typography>
                    {resource.affiliate && (
                      <Chip
                        label="Affiliate"
                        size="small"
                        color="secondary"
                        icon={<VerifiedIcon />}
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {resource.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip label={resource.category} size="small" sx={{ mr: 1 }} />
                    {resource.tags.map((tag) => (
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
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Visit Resource <OpenInNewIcon sx={{ ml: 0.5, fontSize: 16 }} />
                  </MuiLink>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredResources.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No resources found matching your filters.
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
