import { Container, Typography, Box } from '@mui/material';
import { getArticleMetadata } from '@/lib/articles';
import ArticlesList from '@/components/ArticlesList';

export const metadata = {
  title: 'Articles & Guides - UXercise',
  description: 'Educational articles covering strength training fundamentals, nutrition, recovery, and more.',
};

export default function Articles() {
  const articles = getArticleMetadata();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          Articles & Guides
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Educational articles covering strength training fundamentals, nutrition, recovery, and more.
        </Typography>

        <ArticlesList articles={articles} />
      </Box>
    </Container>
  );
}
