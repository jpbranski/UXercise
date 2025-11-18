import { Container, Typography, Box, Chip, Paper, Alert } from '@mui/material';
import Link from 'next/link';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/articles';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} - UXercise`,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        {/* Breadcrumb */}
        <Typography variant="body2" sx={{ mb: 2 }}>
          <Link href="/articles" style={{ color: 'inherit', textDecoration: 'underline' }}>
            ← Back to Articles
          </Link>
        </Typography>

        {/* Article Header */}
        <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          {article.title}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
            Published on{' '}
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          {article.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>

        {/* Article Content */}
        <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
          <Box
            sx={{
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                mt: 3,
                mb: 2,
                fontWeight: 600,
              },
              '& h1': { fontSize: '2rem' },
              '& h2': { fontSize: '1.75rem' },
              '& h3': { fontSize: '1.5rem' },
              '& h4': { fontSize: '1.25rem' },
              '& p': {
                mb: 2,
                lineHeight: 1.8,
              },
              '& ul, & ol': {
                mb: 2,
                pl: 3,
                '& li': {
                  mb: 1,
                  lineHeight: 1.8,
                },
              },
              '& strong': {
                fontWeight: 600,
                color: 'primary.main',
              },
              '& code': {
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                padding: '2px 6px',
                borderRadius: 1,
                fontFamily: 'monospace',
              },
              '& hr': {
                my: 3,
                borderColor: 'divider',
              },
            }}
            dangerouslySetInnerHTML={{
              __html: article.content
                .replace(/^---[\s\S]*?---\n/, '') // Remove frontmatter
                .replace(/\n/g, '<br />') // Basic markdown handling
                .replace(/## (.*?)<br \/>/g, '<h2>$1</h2>')
                .replace(/### (.*?)<br \/>/g, '<h3>$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }}
          />
        </Paper>

        {/* Disclaimer */}
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Disclaimer:</strong> This article is for educational purposes only and is not
            medical or professional advice. Always consult with a qualified healthcare professional
            or certified trainer before starting any new exercise or nutrition program.
          </Typography>
        </Alert>

        {/* Back Link */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Link href="/articles" style={{ color: 'inherit', textDecoration: 'underline' }}>
            ← Back to all articles
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
