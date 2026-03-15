import { sanityClient } from "./client";

export interface SanityPost {
  _id: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  image?: any;
  slug: string;
  body?: any[];
}

const POST_FIELDS = `
  _id,
  title,
  description,
  date,
  tags,
  image,
  "slug": slug.current
`;

export async function getAllPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch(`
    *[_type == "blogPost"] | order(date desc) {
      ${POST_FIELDS}
    }
  `);
}

export async function getAllPostsWithBody(): Promise<SanityPost[]> {
  return sanityClient.fetch(`
    *[_type == "blogPost"] | order(date desc) {
      ${POST_FIELDS},
      body
    }
  `);
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  return sanityClient.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
      ${POST_FIELDS},
      body
    }`,
    { slug }
  );
}
