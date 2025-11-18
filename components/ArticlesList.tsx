'use client';

import { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
} from '@mui/material';
import Link from 'next/link';
import { ArticleMetadata } from '@/lib/articles';

interface ArticlesListProps {
  articles: ArticleMetadata[];
}

export default function ArticlesList({ articles }: ArticlesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set(articles.flatMap((a) => a.tags));
    return Array.from(tags).sort();
  }, [articles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        searchTerm === '' ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTag = !selectedTag || article.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [articles, searchTerm, selectedTag]);

  return (
    <>
      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search articles"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title or description..."
        />
      </Box>

      {/* Tag Filters */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Filter by tag:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="All"
            onClick={() => setSelectedTag(null)}
            color={selectedTag === null ? 'primary' : 'default'}
            sx={{ cursor: 'pointer' }}
          />
          {allTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => setSelectedTag(tag)}
              color={selectedTag === tag ? 'primary' : 'default'}
              variant={selectedTag === tag ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Articles Grid */}
      <Grid container spacing={3}>
        {filteredArticles.map((article) => (
          <Grid item xs={12} md={6} key={article.slug}>
            <Card
              component={Link}
              href={`/articles/${article.slug}`}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(255, 107, 53, 0.2)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                  {article.title}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {article.description}
                </Typography>

                <Box>
                  {article.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredArticles.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No articles found matching your search.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchTerm('');
              setSelectedTag(null);
            }}
            sx={{ mt: 2 }}
          >
            Clear Search
          </Button>
        </Box>
      )}
    </>
  );
}
