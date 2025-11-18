import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export interface ArticleMetadata {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  publishedAt: string;
}

export interface Article extends ArticleMetadata {
  content: string;
}

export function getAllArticles(): Article[] {
  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug: data.slug || slug,
        title: data.title || '',
        description: data.description || '',
        tags: data.tags || [],
        publishedAt: data.publishedAt || '',
        content,
      };
    });

  // Sort by date, newest first
  return articles.sort((a, b) => {
    if (a.publishedAt < b.publishedAt) return 1;
    if (a.publishedAt > b.publishedAt) return -1;
    return 0;
  });
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles();
  return articles.find((article) => article.slug === slug) || null;
}

export function getAllArticleSlugs(): string[] {
  const articles = getAllArticles();
  return articles.map((article) => article.slug);
}

export function getArticleMetadata(): ArticleMetadata[] {
  const articles = getAllArticles();
  return articles.map(({ slug, title, description, tags, publishedAt }) => ({
    slug,
    title,
    description,
    tags,
    publishedAt,
  }));
}
